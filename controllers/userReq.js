import express from 'express';
import User from '../models/users.js';
import passport  from 'passport';
import Story from '../models/stories.js';
import mongoose from 'mongoose';
import fs from 'fs';
import fetch from 'node-fetch';
// import passportLocalMongoose from 'passport-local-mongoose';
// import {Strategy as GoogleStrategy} from 'passport-google-oauth20';


const route = express.Router();

let age = "";
let character = "";
let scenario = "";
let emotions = "";
let values = "";


export function rootRender(req,res){
    if(req.isAuthenticated()){
      res.render("home");
    }else{
      res.redirect("/authenticate2");
    }

};

export function renderlandingPage(req,res){
  res.render("landing-page");
};

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

export function oauthPage(req, res) {
    passport.authenticate('google', { scope: ["profile" , "email"] })(req, res);
};
  


export function oauthVerification(req, res) {
  passport.authenticate('google', {
    failureRedirect: '/authenticate2',
    scope: ["profile", "email"]
  })(req, res, () => {
    res.redirect('/');
  });
};


export function registerUser(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const name = req.body.name;
    const phoneNumber = req.body.phoneNumber;
    const prephoneNumber  = req.body.prephoneNumber;
  
    if (!username || !password) {
      // Handle validation error, e.g., show an error message or redirect to the registration page
      return res.redirect("/register");
    }
  
    User.register({ username: username }, password, (err, user) => {
      if (err) {
        if (err.code === 11000 && err.keyPattern.username === 1) {
          // Handle duplicate email error
          console.log('Duplicate email found.');
          res.redirect("/login");
          // Redirect or show an error message
        } else {
          console.log(err);
          // Handle other errors
          res.redirect("/login");
        }
      } else {
        passport.authenticate("local")(req, res, () => {
          User.findById(req.user.id)
            .then((foundUser)=>{
              foundUser.name = name;
              foundUser.phoneNumber = prephoneNumber + "-" + phoneNumber;
              foundUser.authType = "email";
              foundUser.save()
                .then(()=>{
                  res.redirect("/");
                }).catch((err)=>{
                  console.log(err);
                });
            }).catch((err)=>{
              console.log(err);
            });
          
        });
      }
    });
  };
  

  export function storyPage(req, res) {
    // console.log("Authentication status:", req.isAuthenticated());
    if (req.isAuthenticated()) {
     if(req.user.gems>=1 && req.user.parrots>=1){
      res.render("story");
     }
     else{
      res.redirect("/subscribe");
     }
      
    } else {
      res.redirect("/authenticate2");
    }
  };
  
 
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
                res.redirect("/story");
            });
        }
       });
};


export function storyPost(req,res){
  character = req.body.character;
  age = req.body.age;
  // console.log(age);
  // console.log(character);
  res.redirect("/scenario");
};

export function postScenario(req,res){
  scenario = req.body.scenario;
  // console.log(scenario);
  res.redirect("/emotions");
};

export function postEmotions(req,res){
  emotions = req.body.emotions;
  // console.log(emotions);
  res.redirect("/values");
};

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
    
    res.render("storyoutput",{storyAudio:responseData.audio_path, storyTitle:responseData.title, story:responseData.story, storyImage : responseData.thumb_img_path});
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  
};


export function profileManage(req,res){
  if(req.isAuthenticated()){
    res.render("profile");
  }else{
    res.redirect("/authenticate2");
  }
};


export async function editProfile(req, res) {
  const name = req.body.name;
  const prephoneNumber = req.body.prephoneNumber;
  const phoneNumber = req.body.phoneNumber;
  if(req.isAuthenticated()){
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { 
          $set: { 
            name: name,
            phoneNumber: prephoneNumber + "-" + phoneNumber
          }
        },
        { new: true } // To return the updated document
      );

      if (!updatedUser) {
        // Handle the case where the user is not found
        console.log("not found");
        return res.redirect("/story"); // Redirect or handle the error appropriately
    }

      // Successfully updated user
      // console.log("Updated User:", updatedUser);
      res.redirect("/story");
    } catch (err) {
      console.log(err);
      res.redirect("/story"); // Redirect or handle the error appropriately
      }
    }
    else{
      console.log("User cannot be authenticated");
      res.redirect("/story");
    }
};


export function renderScenario(req,res){
  if(req.isAuthenticated()){
    if(req.user.gems>=1 && req.user.parrots>=1){
      res.render("scenario");
     }
     else{
      res.redirect("/subscribe");
     }
  }
  else{
    res.redirect("/authenticate2");
  }
};

export function renderEmotions(req,res){
  if(req.isAuthenticated()){
    if(req.user.gems>=1 && req.user.parrots>=1){
      res.render("emotions");
     }
     else{
      res.redirect("/subscribe");
     }
  }
  else{
    res.redirect("/authenticate2");
  }
  
};

export function renderValues(req,res){
  if(req.isAuthenticated()){
    if(req.user.gems>=1 && req.user.parrots>=1){
      res.render("values");
     }
     else{
      res.redirect("/subscribe");
     }
  }
  else{
    res.redirect("/authenticate2");
  }

};

export function getStoryOutput(req,res){
  if(req.user.gems>=1 && req.user.parrots>=1){
    res.render("storyoutput");
   }
   else{
    res.redirect("/subscribe");
   }
}


export function getphoneNumber(req,res){
  res.render("otp1");
};

export function getVerification(req,res){
  res.render("otp2");
};