import express from 'express';
import User from '../models/users.js';
import passport  from 'passport';
import Story from '../models/stories.js';
import mongoose from 'mongoose';
import fs from 'fs';
import fetch from 'node-fetch';
import { createInterface } from 'readline';
import initializeTwilioClient from './twilioclient.js';
// import passportLocalMongoose from 'passport-local-mongoose';
// import {Strategy as GoogleStrategy} from 'passport-google-oauth20';

const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
const verifySid = process.env.verifySid;

const client = initializeTwilioClient(accountSid, authToken);


const route = express.Router();

let age = "";
let character = "";
let scenario = "";
let emotions = "";
let values = "";
let globalNumber = "";
let justNumber= "";




export function renderlandingPage(req,res){
  res.render("landing-page");
};
export function rendershp(req,res){
  res.render("story_history");
};

//--Authentication pages--//

export function authenticateRender(req,res){
  res.render("authenticate");
};

export function authenticateRender2(req,res){
  res.render("authenticate2");
};

export function registerRender(req,res){
    res.render("register");
};

export function loginRender(req,res){
    res.render("login");
};

//Google Authentication

export function oauthPage(req, res) {
  passport.authenticate('google', { scope: ["profile" , "email"] })(req, res);
};

export function oauthVerification(req, res) {
passport.authenticate('google', {
  failureRedirect: '/authenticate2',
  scope: ["profile", "email"]
})(req, res, () => {
  res.redirect('/phonenumber');
});
};

//Email Authentication

export function registerUser(req, res) {
const username = req.body.username;
const password = req.body.password;
const name = req.body.name;

if (!username || !password) {
  // Handle validation error, e.g., show an error message or redirect to the registration page
  return res.redirect("/register");
}

User.register({ username: username }, password, (err, user) => {
  if (err) {
    if (err.code === 11000 && err.keyPattern.username === 1) {
      // Handle duplicate email error
      console.log('Duplicate email found.');
      return res.redirect("/login");
      // Redirect or show an error message
    } 
    else {
      console.log(err);
      // Handle other errors
      return res.redirect("/login");
    }
  } else {
    passport.authenticate("local")(req, res, () => {
      User.findById(req.user.id)
        .then((foundUser) => {
          foundUser.name = name;
          foundUser.authType = "email";
          foundUser.save()
            .then(() => {
              res.redirect("/phonenumber");
            }).catch((err) => {
              console.log(err);
            });
        }).catch((err) => {
          console.log(err);
        });
    });
  }
});
};

//Email login

export function loginUser(req,res){
  const loginuser = new User({
      username: req.body.username,
      password: req.body.password
     });
     req.login(loginuser,function(err){
      if(err){
          console.log(err);
      }else{
          passport.authenticate("local")(req,res,()=>{
              res.redirect("/");
          });
      }
     });
};


//--OTP Verification pages and functions for new users--//


export function getphoneNumber(req,res){
  // console.log(req.user.phoneNumber);
  if(req.isAuthenticated()){
    if(!req.user.phoneNumber){
      res.render("otp1");
    }
    else{
      res.redirect("/");
    }
  }else{
    res.redirect("/authenticate2");
  }
};

//OTP is send to the given number

export async function postPhonenumber(req, res) {
  try {
    const mobileNumber =  req.body.prephoneNumber + "-" + req.body.phoneNumber;
    globalNumber = mobileNumber;
    justNumber = req.body.prephoneNumber + req.body.phoneNumber;
    // console.log(mobileNumber);
    const foundUser = await User.findOne({ phoneNumber: mobileNumber });

    if (foundUser) {
      // If a user with the same phone number exists
      const errorMessage = "Duplicate contact number found. Please use a different contact number.";
      const script = `<script>alert("${errorMessage}"); window.location.href="/phonenumber";</script>`;
      return res.send(script);
    } else {
      // No user found with the provided phone number
      console.log("No duplicate contact number found. Proceeding...");
       // Trigger Twilio verification process
       const verification = await client.verify.v2.services(verifySid)
       .verifications.create({ to: justNumber, channel: "sms" });
     
     console.log(verification.status); // Log the verification status

     // Render the OTP verification page
     res.render("otp2");
    }
  } catch (err) {
    console.log(err);
    return res.redirect("/error");
  }
};

//Verification

export async function otpVerification(req,res){
  try {
    if(req.isAuthenticated()){
      const otp = req.body.digit1 + req.body.digit2 + req.body.digit3 + req.body.digit4 + req.body.digit5 + req.body.digit6;
    // Perform Twilio verification check
    const verification_check = await client.verify.v2
      .services(verifySid)
      .verificationChecks.create({ 
        to: justNumber, 
        code: otp,
        channel : "sms",
        customCode: "Storyia: Your verification code is {{code}}. Please enter this code to verify your account."
       });

    // Check verification status
    if (verification_check.status === 'approved') {
      // Verification successful
      console.log('Verification successful!'); 
      await User.findOneAndUpdate({ _id: req.user.id }, { phoneNumber: globalNumber });
      const message = "Your phone number is verified";
      const script = `<script>alert("${message}"); window.location.href="/";</script>`;
      return res.send(script);
    } 
    else {
      // Verification failed
      console.log('Verification failed. Please try again.'); // You can also redirect to a failure page
      const errorMessage = "Verification failed. Please try again.";
      const script = `<script>alert("${errorMessage}"); window.location.href="/phonenumber";</script>`;
      return res.send(script);
    }
  }else{
    res.redirect("/authenticate2");
  }
    
  } catch (err) {
    console.error(err);
    res.redirect('/error'); // Redirect to an error page
  }

};

export function getr(req,res){
  res.render("random");
  client.verify.v2
  .services(verifySid)
  .verifications.create({ to: justNumber, channel: "sms" })
  .then((verification) => console.log(verification.status))
  .then(() => {
    const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });
rl.question("Please enter the OTP:", (otpCode) => {
  client.verify.v2
    services(verifySid)
    .verificationChecks.create({ to: justNumber, code: otpCode })
    .then((verification_check) => console.log(verification_check.status))
    .then(() => rl.close());
  });
});
};

export function getotp(req,res){
res.redirect("/register");
}

//-- Home page --//

export function rootRender(req,res){
  if(req.isAuthenticated()){
    if(req.user.phoneNumber){
      res.render("home",{
        gems : req.user.gems,
        parrots : req.user.parrots,
      });
    }else{
      res.redirect("/phonenumber");
    }
  }else{
    res.redirect("/authenticate2");
  }
};


//--Story Generation Pages--//

//Story - GET,POST
export function storyPage(req, res) {
  // console.log("Authentication status:", req.isAuthenticated());
  if (req.isAuthenticated()) {
    if(req.user.phoneNumber){    
   if(req.user.gems>=1 && req.user.parrots>=1){
    res.render("story",{
      gems : req.user.gems,
      parrots : req.user.parrots,
    });
   }
   else{
    res.redirect("/subscribe");
   }
    
    }else{
      res.redirect("/phonenumber");
    }
  } else {
    res.redirect("/authenticate2");
  }
  
};
  
export function storyPost(req,res){
  character = req.body.character;
  age = req.body.age;
  // console.log(age);
  // console.log(character);
  res.redirect("/scenario");
};


//Scenario - GET,POST

export function renderScenario(req,res){
  if(req.isAuthenticated()){
    if(req.user.gems>=1 && req.user.parrots>=1){
      res.render("scenario",{
        gems : req.user.gems,
        parrots : req.user.parrots,
      });
     }
     else{
      res.redirect("/subscribe");
     }
  }
  else{
    res.redirect("/authenticate2");
  }
};

export function postScenario(req,res){
  scenario = req.body.scenario;
  // console.log(scenario);
  res.redirect("/emotions");
};


//Emotions - GET,POST

export function renderEmotions(req,res){
  if(req.isAuthenticated()){
    if(req.user.gems>=1 && req.user.parrots>=1){
      res.render("emotions",{
        gems : req.user.gems,
        parrots : req.user.parrots,
      });
     }
     else{
      res.redirect("/subscribe");
     }
  }
  else{
    res.redirect("/authenticate2");
  }
  // res.render("emotions");
};

export function postEmotions(req,res){
  emotions = req.body.emotions;
  // console.log(emotions);
  res.redirect("/values");
};


//Values- GET,POST

export function renderValues(req,res){
  if(req.isAuthenticated()){
    if(req.user.gems>=1 && req.user.parrots>=1){
      res.render("values",{
        gems : req.user.gems,
        parrots : req.user.parrots,
      });
     }
     else{
      res.redirect("/subscribe");
     }
  }
  else{
    res.redirect("/authenticate2");
  }

};

//Main story creation with api call and updation in database//
export async function postValues(req,res){
  values = req.body.values;
  // console.log(values);
  const endpoint = 'http://20.84.90.82:8080/generate_story';

  // Define multiple parameters
  const params = new URLSearchParams({
    age: "10",
    character: JSON.stringify(character),
    scenario: scenario,
    emotions: JSON.stringify(emotions),
    values: JSON.stringify(values),
    userId: "test"
  });
  // console.log(`${endpoint}?${params.toString()}`);

  try {
    const response = await fetch(`${endpoint}?${params.toString()}`, {
      method: 'POST',
      // Add headers if required
    });

    if (!response.ok) {
      console.error('HTTP status code:', response.status);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error('Network response was not ok.');
    }

    const responseData = await response.json();

    //Storing the story in database after it is generated

    const uname = req.user.username;
    const uid = req.user.id;
    const createstory = await Story.create({
      userId : uid,
      title: responseData.title,
      story: responseData.story,
      thumb_img_path : responseData.thumb_img_path,
      audiopath : responseData.audio_path,
    }); 

    const gemstodeduct = 1;
    const parrotstodeduct = 1;

    const user = await User.findOne({ username: uname });
    if (user) {
      // Check if the user has enough gems and parrots
      if (user.gems >= 1 && user.parrots >= 1) {
        user.gems -= gemstodeduct;
        user.parrots -= parrotstodeduct;
        await user.save(); // Save the updated user
      } else {
        console.log("Insufficient gems or parrots");
        // Handle insufficient gems or parrots error scenario
        // You can redirect or send an error response as needed
        return res.status(400).send("Insufficient gems or parrots");
      }
    } else {
      console.log("User not found");
      // Handle the case where the user is not found
      return res.status(404).send("User not found");
    }
   
    let objId = new mongoose.Types.ObjectId(createstory.id);
    await User.updateOne({
      username:uname
    },
    {
      $push:{
        stories : objId,
      },
    },
    {upsert : false, new : true},
    );

    //After storing the story in database, it is displayed in frontend
    
    res.render("storyoutput",{storyAudio:responseData.audio_path, storyTitle:responseData.title, story:responseData.story, storyImage : responseData.thumb_img_path, gems : req.user.gems, parrots : req.user.parrots});
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  
};

//Storyoutput
// export function getStoryOutput(req,res){
//   if(req.user.gems>=1 && req.user.parrots>=1){
//     res.render("storyoutput");
//    }
//    else{
//     res.redirect("/subscribe");
//    }
// }


//--Profile management--// 
export function profileManage(req,res){
  if(req.isAuthenticated()){
    res.render("profile",{
      gems : req.user.gems,
      parrots : req.user.parrots,
    });
  }else{
    res.redirect("/authenticate2");
  }
};

//Profile - POST
export async function editProfile(req, res) {
  const name = req.body.name;
  const prephoneNumber = req.body.prephoneNumber;
  const phoneNumber = req.body.phoneNumber;
  
  if (req.isAuthenticated()) {
    try {
      let updateFields = {}; // Object to store fields to update

      if (name && name !== "") {
        updateFields.name = name; // Update name only if it's provided
      }

      if (phoneNumber && phoneNumber !== "" && prephoneNumber !== phoneNumber) {
        // Update phoneNumber only if it's provided and different from prephoneNumber
        updateFields.phoneNumber = prephoneNumber + "-" + phoneNumber;
      }

      if (Object.keys(updateFields).length === 0) {
        // If no fields to update, redirect back without DB interaction
        return res.redirect("/");
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { $set: updateFields },
        { new: true } // To return the updated document
      );

      if (!updatedUser) {
        console.log("User not found");
        return res.redirect("/"); // Redirect or handle the error appropriately
      }

      // console.log("Updated User:", updatedUser);
      res.redirect("/"); // Successfully updated user
    } catch (err) {
      console.log(err);
      res.redirect("/"); // Redirect or handle the error appropriately
    }
  } else {
    console.log("User cannot be authenticated");
    res.redirect("/authenticate2");
  }
};



export function getStoryOutput(req,res){
  if(req.user.gems>=1 && req.user.parrots>=1){
    res.render("storyoutput",{
      gems : req.user.gems,
      parrots : req.user.parrots,
    });
   }
   else{
    res.redirect("/subscribe");
   }
}

