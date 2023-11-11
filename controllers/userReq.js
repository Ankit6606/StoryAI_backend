import express from 'express';
import User from '../models/users.js';
import passport  from 'passport';
import passportLocalMongoose from 'passport-local-mongoose';
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';


const route = express.Router();

export function rootRender(req,res){
    res.render("home");
};

export function registerRender(req,res){
    res.render("register");
};

export function loginRender(req,res){
    res.render("login");
};

export function oauthPage(req, res) {
    passport.authenticate('google', { scope: ["profile"] })(req, res);
};
  


export function oauthVerification(req, res) {
    passport.authenticate('google', {
      failureRedirect: '/login'
    })(req, res, () => {
      // Successful authentication, redirect to /story.
      res.redirect('/story');
    });
};
  

export function registerUser(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const name = req.body.name;
    const phoneNumber = req.body.phoneNumber;
  
    if (!username || !password) {
      // Handle validation error, e.g., show an error message or redirect to the registration page
      return res.redirect("/register");
    }
  
    User.register({ username: username }, password, (err, user) => {
      if (err) {
        if (err.code === 11000 && err.keyPattern.username === 1) {
          // Handle duplicate email error
          console.log('Duplicate email found.');
          // Redirect or show an error message
        } else {
          console.log(err);
          // Handle other errors
          res.redirect("/register");
        }
      } else {
        passport.authenticate("local")(req, res, () => {
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
          
        });
      }
    });
  }
  

export function storyPage(req,res){
  if(req.isAuthenticated()){
    res.render("story");
}else{
    res.redirect("/login");
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
  res.render("createstory1");
};

export function storyPost(req,res){
  res.redirect("/createstory1");
};

export function createStory1Post(req,res){
  const agegroup = req.body.agegroup;
  console.log(agegroup);
  console.log(req.body.charactername);
}