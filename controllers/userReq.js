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
let emotions = "hb";
let values = "";


export function rootRender(req,res){
    // if(req.isAuthenticated()){
    //   res.redirect("/story");
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
    res.render("register2");
};

export function oauthPage(req, res) {
    passport.authenticate('google', { scope: ["profile" , "email"] })(req, res);
};
  


export function oauthVerification(req, res) {
  passport.authenticate('google', {
    failureRedirect: '/authenticate',
    scope: ["profile", "email"]
  }, (err, user) => {
    if (err) {
      console.error("Error during Google authentication:", err);
      return res.redirect('/authenticate');
    }
    
    console.log("User authenticated:", user); // Log user object after successful authentication
    res.redirect('/story'); // Redirect to story page after successful authentication
  })(req, res);
};


export function registerUser(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const name = req.body.name;
    const phoneNumber = req.body.phoneNumber;
    const prephoneNumber  = req.body.prephoneNumber;
    console.log(prephoneNumber);
  
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
  }
  

  export function storyPage(req, res) {
    console.log("Authentication status:", req.isAuthenticated());
    console.log("User:", req.user); // Log user details
    
    if (req.isAuthenticated()) {
      res.render("story");
    } else {
      res.redirect("/authenticate");
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

export function storyCharacters(req,res){
  if(req.isAuthenticated()){
    res.render("createstory1");
  }else{
    res.redirect("/login");
  }
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
    console.log(req.user.id);
    res.render("profile");
  }else{
    res.redirect("/authenticate");
  }
  // res.render("profile");
};

export function editProfile(req, res) {
  const name = req.body.name;
  const prephoneNumber = req.body.prephoneNumber;
  const phoneNumber = req.body.phoneNumber;

  User.findByIdAndUpdate(
    req.user.id,
    { 
      $set: { 
        name: name,
        phoneNumber: prephoneNumber + "-" + phoneNumber
      }
    },
    { new: true }, // To return the updated document
    (err, updatedUser) => {
      if (err) {
        console.log(err);
        return res.redirect("/story"); // Redirect or handle the error appropriately
      }
      // Successfully updated user
      console.log("Updated User:", updatedUser);
      res.redirect("/story");
    }
  );
}


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
// export function userPay(req,res){
//   res.render("payment_dashboard");
// };



export function userlogin(req,res){
  res.render("register2");
}