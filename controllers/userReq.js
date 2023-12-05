import express from 'express';
import User from '../models/users.js';
import passport  from 'passport';
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
    // if(req.isAuthenticated()){
    //   res.redirect("/");
    // }else{
    //   res.redirect("/login");
    // }
    res.render("home");
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
    res.redirect('/story');
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
              foundUser.gems = 5;
              foundUser.parrots = 2;
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
     if(req.user.gems>=5 && req.user.parrots>=2){
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
  console.log(age);
  console.log(character);
  res.redirect("/scenario");
};

export function postScenario(req,res){
  scenario = req.body.scenario;
  console.log(scenario);
  res.redirect("/emotions");
};

export function postEmotions(req,res){
  emotions = req.body.emotions;
  console.log(emotions);
  res.redirect("/values");
};

export async function postValues(req,res){
  values = req.body.values;
  console.log(values);
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

    res.json(responseData);
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



export function selectSubscription(req,res){
  fs.readFile('items.json',function(error,data){
    if(error){
      res.status(500).end();
    }else{
      res.render("subscribe",{
        items: JSON.parse(data)
      });
    }
  })
}

export function renderScenario(req,res){
  res.render("scenario");
}

export function renderEmotions(req,res){
  res.render("emotions");
};

export function renderValues(req,res){
  res.render("values");
};

export function getStoryOutput(req,res){
  res.render("storyoutput");
}


