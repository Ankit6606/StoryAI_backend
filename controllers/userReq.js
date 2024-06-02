import express from 'express';
import bodyParser from 'body-parser';
import crypto from 'crypto';
import User from '../models/users.js';
import session from 'express-session';
import flash from 'connect-flash';
import passport  from 'passport';
import Story from '../models/stories.js';
import mongoose from 'mongoose';
import fs from 'fs';
import fetch from 'node-fetch';
import https from 'https';
import { createInterface } from 'readline';
import initializeTwilioClient, {initialLang} from './twilioclient.js';
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
let globalNumber = "";   //For storing in database
let globalNumber2 = "";
let justNumber= "";  //For Twilio
let justNumber2 = "";  //For twilio password recovery
let story = [];
let storyHistory = 0;
// let initialLang = "none";
let passwordRecovery = "no";



export function renderppPage(req,res){
  res.render("pp");
};

export function rendertncPage(req,res){
  res.render("tnc");
};

export function renderpublishPage(req,res){
  res.render("publish");
};

export function renderaiPage(req,res){
  res.render("ai");
};

export function renderlandingPage(req,res){
  if(req.isAuthenticated()){
    res.redirect("/home");
  }
  else{
    res.render("landing-page");
  }
};

//--Authentication pages--//

export function authenticateRender(req,res){
  initialLang = "eng";
  res.render("authenticate");
};

export function authenticateRender2(req,res){
  initialLang = "eng";
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
      const message = "An user with this email is already present, please login ";
      const script = `<script>alert("${message}"); window.location.href="/login";</script>`;
      return res.send(script);
      // Redirect or show an error message
    } 
    else {
      console.log("error:",err);
      // Handle other errors
      const message = "An user with this email is already present, please login ";
      const script = `<script>alert("${message}"); window.location.href="/login";</script>`;
      return res.send(script);
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
        passport.authenticate('local', (err, user, info) => {
          if (err) {
              // Handle error if something goes wrong during authentication
              return res.status(500).send(err.message); // You can handle the error as per your application's logic
          }
          if (!user) {
              // If authentication fails, provide a flash message indicating the issue
              // req.flash('error', 'Please check your email and password.');
              const message = "Either email or password is wrong";
              const script = `<script>alert("${message}"); window.location.href="/login";</script>`;
              return res.send(script); // Redirect to the login page or any appropriate route
          }
          // If authentication succeeds, log in the user and redirect
          req.logIn(user, (loginErr) => {
              if (loginErr) {
                  // Handle login error if occurred
                  return res.status(500).send(loginErr.message); // You can handle the error as per your application's logic
              }
      
              // If login is successful, redirect the user to the desired page
              
              return res.redirect('/home');
          });
      })(req, res);
      
      }
     });
};

//Logout

export function userLogout(req,res){
  req.logout(function(err){
    if(err){
        console.log(err);
    }
    else{
        res.redirect("/home");
    }
  })
}


//--OTP Verification pages and functions for new users--//


export function getphoneNumber(req,res){
  // console.log(req.user.phoneNumber);
  if(req.isAuthenticated()){
    if(!req.user.phoneNumber){
      if(initialLang==="eng"){
        console.log(initialLang);
        res.render("otp1");
      }else{
        res.redirect("/fr/phonenumber");
      }
      
    }
    else{
      res.redirect("/home");
    }
  }else{
    res.redirect("/authenticate2");
  }
};


//OTP is send to the given number

export async function postPhonenumber(req, res) {
  try {
    if(req.isAuthenticated()){
      const mobileNumber = req.body.prephoneNumber + "-" + req.body.phoneNumber;
      const cleanedMobileNumber = mobileNumber.replace(/\s/g, ''); // Removes all spaces from mobileNumber
      globalNumber = cleanedMobileNumber;
      // console.log(globalNumber);
      initialLang = "";
      
      justNumber = (req.body.prephoneNumber + req.body.phoneNumber).replace(/\s/g, '');
      // console.log(justNumber);
      const foundUser = await User.findOne({ phoneNumber: cleanedMobileNumber });
  
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
    }
    else{
      res.redirect("/authenticate2");
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
      const script = `<script>alert("${message}"); window.location.href="/home";</script>`;
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



//-- Home page --//

export async function rootRender(req,res){
  if(req.isAuthenticated()){
    if(req.user.phoneNumber){
      storyHistory = 0;
      const user = await User.findById(req.user._id)
      .select('+salt +hash')
      .populate('stories')
      .exec();

      
      
      if (!user) {
        throw new Error('User not found');
      }


      //--------Password Recovery function---------//
      // user.setPassword("1234567", async () => {
        
      //   // Save user with new password
      //   await user.save();
  
      //   // Redirect or respond with success message
      //   console.log("Password changed");
      // });
      
      res.render("home",{
        userStories: user.stories,
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

export async function rootPost(req,res){
  try {
    if(req.isAuthenticated()){
      if(req.user.phoneNumber){
        storyHistory = 1;
        const  storyId  = req.body.storyId; // Assuming the storyId is sent in the request body

    // Store the selected storyId in the session
        req.session.selectedStoryId = storyId;

    // Send a success response back to the front end
        res.redirect("/storyoutput");
      }
      else{
        res.redirect("/phonenumber");
      }
    }
    else{
      res.redirect("/authenticate2");
    }
    
} catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
}
}


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
  if(req.isAuthenticated()){
    if(req.user.phoneNumber){
      if(req.user.gems>=1 && req.user.parrots>=1){
        character = req.body.character;
        age = req.body.age;
        console.log(age);
        // console.log(character);
        res.redirect("/scenario");
      }else{
        res.redirect("/subscribe");
      }
      
    }else{
      res.redirect("/phonenumber");
    }
  }else{
    res.redirect("/authenticate2");
  }
 
};


//Scenario - GET,POST

export function renderScenario(req,res){
  if(req.isAuthenticated()){
    if(req.user.phoneNumber){
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
      res.redirect("/phonenumber");
    }
    
  }
  else{
    res.redirect("/authenticate2");
  }
};

export function postScenario(req,res){
  if(req.isAuthenticated()){
    if(req.user.phoneNumber){
      if(req.user.gems>=1 && req.user.parrots>=1){
        scenario = req.body.scenario;
      console.log(scenario);
      res.redirect("/emotions");
      }else{
        res.redirect("/subscribe");
      }
      
    }else{
      res.redirect("/phonenumber");
    }
  }else{
    res.redirect("/authenticate2");
  }
};


//Emotions - GET,POST

export function renderEmotions(req,res){
  if(req.isAuthenticated()){
    if(req.user.phoneNumber){
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
      res.redirect("/phonenumber");
    }
   
  }
  else{
    res.redirect("/authenticate2");
  }
  // res.render("emotions");
};

export function postEmotions(req,res){
  if(req.isAuthenticated()){
    if(req.user.phoneNumber){
      if(req.user.gems>=1 && req.user.parrots>=1){
        emotions = req.body.emotions;
        console.log(emotions);
        res.redirect("/values");
      }else{
        res.redirect("/subscribe");
      }
    }else{
      res.redirect("/phonenumber");
    }
  }else{
    res.redirect("/authenticate2");
  }
};



//Values- GET,POST


export function renderValues(req,res){
  if(req.isAuthenticated()){
    if(req.user.phoneNumber){
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
      res.redirect("/phonenumber");
    }
  }
  else{
    res.redirect("/authenticate2");
  }

};

//Main story creation with api call and updation in database//
export async function postValues(req,res){
  if(req.isAuthenticated()){
    if(req.user.phoneNumber){
      if(req.user.gems>=1 && req.user.parrots>=1){
        values = req.body.values;
        console.log('Request Body:', req.body);
        console.log('Values:', values);


  const endpoint = 'https://storyia.app/api/generate_story';

  // Define multiple parameters
  const params = new URLSearchParams({
    age: JSON.stringify(age),
    characters: JSON.stringify(character),
    scenario: scenario,
    emotions: JSON.stringify(emotions),
    values: JSON.stringify(values),
    userId: "test",
    lang:"eng"
  });
  console.log(`${endpoint}?${params.toString()}`);

  try {
    const response = await fetch(`${endpoint}?${params.toString()}`, {
      method: 'POST',
      // Add headers if required
      agent: new https.Agent({ rejectUnauthorized: false }) // Import 'https' module if not already imported
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
    const audioDuration = responseData.audio_duration;
    const audiodurationInMinutes = isNaN(audioDuration) ? 0 : (audioDuration / 60).toFixed(2);
    const createstory = await Story.create({
      userId : uid,
      title: responseData.title,
      story: responseData.story,
      thumb_img_path : responseData.thumb_img_path,
      audiopath : responseData.audio_path,
      audioduration : audiodurationInMinutes
    }); 
   
    await createstory.save();
    let objId = createstory._id;
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
    if(responseData.title !== "Story Generation Error - Please re-check your Parameters"){
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
    }
    
    //After storing the story in database, it is displayed in frontend
    
  //  await renderStoryOutput(req,res,responseData);
    await res.redirect("/storyoutput");
    
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
      }else{
        res.redirect("/subscribe");
      }
    }else{
      res.redirect("/phonenumber");
    }
  }else{
    res.redirect("/authenticate2");
  }
};


// async function renderStoryOutput(req,res,responseData){
//   try {
//     res.render("storyoutput", {
//       storyAudio: responseData.audio_path,
//       storyTitle: responseData.title,
//       story: responseData.story,
//       storyImage: responseData.thumb_img_path,
//       gems: req.user.gems,
//       parrots: req.user.parrots
//     });
//   } catch (renderError) {
//     console.error('Error rendering "storyoutput" template:', renderError);
//     res.status(500).json({ error: 'Internal Server Error during rendering' });
//   }
// }



//---Story History---//

//Story history - GET
export const rendershp = async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      if(req.user.phoneNumber){
        // Fetch the user's details along with populated stories
        storyHistory = 0;
        console.log("storyhistory:",storyHistory);
      const user = await User.findById(req.user._id).populate('stories').exec();
      
      if (!user) {
        throw new Error('User not found');
      }
      
      // User found, render the story history page
      res.render("story_history", {
        userStories: user.stories,
        gems : req.user.gems,
        parrots : req.user.parrots
      });
      }
      else{
        res.redirect("/phonenumber");
      }
      
    } else {
      res.redirect("/authenticate2");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching user details');
  }
};


//Story History - POST
export function clickStories(req,res){
  try {
    if(req.isAuthenticated()){
      if(req.user.phoneNumber){
        storyHistory = 1;
        // console.log(storyHistory);
        const  storyId  = req.body.storyId; // Assuming the storyId is sent in the request body

    // Store the selected storyId in the session
        req.session.selectedStoryId = storyId;

    // Send a success response back to the front end
        res.redirect("/storyoutput");
      }
      else{
        res.redirect("/phonenumber");
      }
    }
    else{
      res.redirect("/authenticate2");
    }
    
} catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


//--Story output page--//

export async function showStories(req,res){
  try {
    if(req.isAuthenticated()){
      if(req.user.phoneNumber){
        if(storyHistory===1){
          const { selectedStoryId } = req.session;

    // Check if a storyId is stored in the session
       if (!selectedStoryId) {
        // If no storyId is found in the session, redirect to an error page or handle it as needed
          return res.status(404).json({ error: 'Story ID not found in session' });
      }

    // Fetch story details using the stored storyId from the database or data source
      const storyDetails = await Story.findById(selectedStoryId); // Example using a hypothetical StoryModel
      // console.log(storyDetails.userId);

      if (!storyDetails) {
        // If story with stored ID is not found, return an error message
        return res.status(404).json({ error: 'Story not found' });
      }

    // If the story is found, render the storyoutput page with the story details
        res.render('storyoutput', { story: storyDetails.story , storyImage : storyDetails.thumb_img_path , storyAudio : storyDetails.audiopath, storyTitle: storyDetails.title,
                                gems :req.user.gems, parrots: req.user.parrots});
        // storyHistory = 0;
        }
        else{
          const storyUser = await User.findOne({_id : req.user.id});
          if(storyUser){
            const storyLength = storyUser.stories.length;
            //Select the last story in the database , becz that is the story which is generated recently
            //Select its id
            const storyOutputId = storyUser.stories[storyLength-1]._id;
            const lastStory = await Story.findById(storyOutputId);
            if(lastStory){
              res.render('storyoutput', { story: lastStory.story , storyImage : lastStory.thumb_img_path , storyAudio : lastStory.audiopath, storyTitle: lastStory.title,
                gems :req.user.gems, parrots: req.user.parrots});
            }else{
              return res.status(404).json({ error: 'Story not found' });
            }
          }
          else{
            console.log("User not found");
          }
        }
      }else{
        res.redirect("/phonenumber");
      }
    }else{
      res.redirect("/authenticate2");
    } 
} catch (err) {
    // Handle any errors that might occur during the process
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
}
};


//--Profile management--// 

//Profile - GET
export function profileManage(req,res){
  if(req.isAuthenticated()){
    if(req.user.phoneNumber){

//----------For Password change----------------//

      // user.changePassword(oldPassword,newPassword,function(err){
      //   if(err){
      //     res.send(err);
      //   }else{
      //     console.log("password changed");
      //   }
      // })

      
      res.render("profile",{
        gems : req.user.gems,
        parrots : req.user.parrots,
        Name : req.user.name
      });
    }else{
      res.redirect("/phonenumber");
    }
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
    if(req.user.phoneNumber){
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
          return res.redirect("/home"); // Redirect or handle the error appropriately
        }
  
        // console.log("Updated User:", updatedUser);
        res.redirect("/profile"); // Successfully updated user
      } catch (err) {
        console.log(err);
        res.redirect("/home"); // Redirect or handle the error appropriately
      }
    }
    else{
      res.redirect("/phonenumber");
    }
    
  } else {
    console.log("User cannot be authenticated");
    res.redirect("/authenticate2");
  }
};

//GET//
export async function getOTPForPassword(req,res){
  res.render("recoverPass1");
}

export async function changePassword(req,res){
  if(passwordRecovery === "yes"){
    res.render("recoverPass2");
  }else{
    res.redirect("/passwordotp");
  }
}

export async function changePassword2(req,res){
  if(req.isAuthenticated()){
    if(req.user.phoneNumber){
      res.render("changePass");
    }else{
      res.redirect("/phonenumber");
    }
  }else{
    res.redirect("/authenticate2");
  }
}


//POST//

export async function verifyEmailAndNumber(req,res){
  const emailId = req.body.username;
  const phnNumber = req.body.prephoneNumber + "-" + req.body.phoneNumber;
  // console.log(phnNumber);
  globalNumber2 = phnNumber;
  justNumber2 = req.body.prephoneNumber + req.body.phoneNumber;
  const user = await User.findOne({phoneNumber : phnNumber});
  if(user){
    if(user.username === emailId){
      passwordRecovery = "yes";
      const verification = await client.verify.v2.services(verifySid)
      .verifications.create({ to: justNumber2, channel: "sms" });
    
      console.log(verification.status); // Log the verification status
      res.redirect("/recoverPassword");
     
    }else{
      const errorMessage = "Please check your email id, it does not match with the email id of the registered user";
      const script = `<script>alert("${errorMessage}"); window.location.href="/passwordotp";</script>`;
      return res.send(script);
    }
  }else{
    const errorMessage = "No such user is present with this phone number, please create a new account.";
    const script = `<script>alert("${errorMessage}"); window.location.href="/authenticate";</script>`;
    return res.send(script);
  }
};

export async function otpVerificationForPasswordChange(req,res){
  if(passwordRecovery === "yes"){
    const recoveryOtp = req.body.recoveryOtp;
  const newPassword  = req.body.password;
  const confirmPassword = req.body.confirmedPassword;

  const verification_check = await client.verify.v2
      .services(verifySid)
      .verificationChecks.create({ 
        to: justNumber2, 
        code: recoveryOtp,
        channel : "sms",
        customCode: "Storyia: Your verification code for password change is {{code}}."
       });

       // Check verification status
    if (verification_check.status === 'approved'){
      //verification successful
      console.log("Verification successful");
      const user = await User.findOne({phoneNumber : globalNumber2});
      if(user){
        if(newPassword === confirmPassword){
          user.setPassword(confirmPassword, async () => {
          
          // Save user with new password
          await user.save();
    
          // Redirect or respond with success message
          console.log("Password changed");
          const message = "Your password has been changed successfully."
          const script = `<script> alert("${message}"); window.location.href = "/login"; </script>`;
          return res.send(script);
        });
        }else{
          console.log(newPassword + "!=" + confirmPassword);
          const errMsg = "The 'Confirm New Password' must be same as 'New Password'. Try again."
          const script = `<script> alert("${errMsg}"); window.location.href = "/passwordotp"; </script>`;
          return res.send(script);
        }
      }
    }
    else {
      // Verification failed
      console.log('Verification failed. Please try again.'); // You can also redirect to a failure page
      const errorMessage = "Verification failed. Please try again.";
      const script = `<script>alert("${errorMessage}"); window.location.href="/passwordotp";</script>`;
      return res.send(script);
    }
  }else{
    res.redirect("/passwordotp");
  }
};

export async function passwordChangeFromProfile(req,res){
  if(req.isAuthenticated()){
    if(req.user.phoneNumber){
      const oldPassword = req.body.currentPassword;
      const newPassword = req.body.password;
      const confirmPassword = req.body.confirmedPassword;

      const user = await User.findOne({_id: req.user.id});
      if(user){
        if(newPassword === confirmPassword){
          //----------For Password change----------------//
          user.changePassword(oldPassword,confirmPassword,function(err){
            if(err){
              const errMsg = "The current password you entered is wrong, please check again.";
              const script = `<script>alert("${errMsg}"); window.location.href="/changePassword";</script>`;
              return res.send(script);
            }else{
              console.log("password changed");
              const msg = "Your password has been successfully changed";
              const script = `<script>alert("${msg}"); window.location.href="/profile";</script>`;
              return res.send(script);
            }
          })
        }
      }else{
        console.log("User not found");
        const errMsg = "There was an error. Please login.";
        const script = `<script>alert("${errMsg}"); window.location.href="/authenticate2";</script>`;
        return res.send(script);
      }
    }else{
      res.redirect("/phonenumber");
    }
  }else{
    res.redirect("/authenticate2");
  }
}