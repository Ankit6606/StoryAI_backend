import express from 'express';
import User from '../models/users.js';
import passport  from 'passport';
import fs from 'fs';
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
      failureRedirect: '/login',
      scope: ["profile", "email"]
    })(req, res, () => {
      // Successful authentication, redirect to /story.
      res.redirect('/');
    });
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
  

export function storyPage(req,res){
  // if(req.isAuthenticated()){
  //   res.render("story");
    
  // }else{
  //   res.redirect("/login");
  // }
  res.render("story");
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
  // age = req.breq.body.characterody.option;
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

export function postValues(req,res){
  values = req.body.values;
  console.log(values);
};

export function createStory1Post(req,res){
  const agegroup = req.body.agegroup;
  console.log(agegroup);
  console.log(req.body.charactername);
}

export function profileManage(req,res){
  if(req.isAuthenticated()){
    console.log(req.user.id);
    res.render("profile");
  }else{
    res.redirect("/authenticate");
  }
  // res.render("profile");
};

export function editProfile(req,res){
  const name = req.body.name;
  const phoneNumber= req.body.phoneNumber;
  User.findById(req.user.id)
    .then((foundUser)=>{
      foundUser.name = name;
      foundUser.phoneNumber = phoneNumber;
      foundUser.save()
        .then(()=>{
          res.redirect("/story");
        }).catch((err)=>{
          console.log(err);
        });
    }).catch((err)=>{
      console.log(err);
    });
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
// export function userPay(req,res){
//   res.render("payment_dashboard");
// };

