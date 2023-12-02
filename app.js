import express from 'express';
import 'dotenv/config';
import session from 'express-session';
import passportLocalMongoose from 'passport-local-mongoose';
import passport  from 'passport';
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import { userApp } from './routes/user.js';
import {connectDatabase} from './dbmongo.js';
import User  from './models/users.js';
import Payment from './models/users.js';

// payment portion

// require("dotenv").config();

// const app = require('express')();
// var http = require('http').Server(app);

// const paymentRoute = require('./routes/paymentRoute');

// app.use('/payment-dashboard',paymentRoute);

// http.listen(3000, function(){
//     console.log('Server is running');
// });



const app = express();//For the main web application


app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'my secret',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());



// connectDatabase("mongodb://127.0.0.1:27017/story-app",{useNewUrlParser:true,useUnifiedTopology: true})
// .then(()=>{
//     console.log("Mongodb connected");
// });

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id)
      .then(function(user) {
        done(null, user); // Return found user21
      })
      .catch(function(err) {
        done(err, null); // Return error if user retrieval fails
      });
  });
  

  passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/story",
    scope: ['profile', 'email'],
  },
  function(accessToken, refreshToken, profile, cb) {
    const userEmail = profile.emails[0].value;
  
    User.findOne({ googleId: profile.id })
      .then(existingUser => {
        if (existingUser) {
          // User already exists, return the user
          return cb(null, existingUser);
        } else {
          // Create a new user
          const newUser = new User({ 
            googleId: profile.id, 
            name: profile.displayName, 
            username: userEmail, 
            authType: "google"
          });
  
          return newUser.save()
            .then(savedUser => {
              // New user created successfully
              return cb(null, savedUser);
            })
            .catch(saveErr => {
              console.error("Error creating new user:", saveErr);
              return cb(saveErr, null);
            });
        }
      })
      .catch(err => {
        console.error("Error finding user:", err);
        return cb(err, null);
      });
  }));
  
  
  

// passport.use(new GoogleStrategy({
//     clientID: process.env.CLIENT_ID,
//     clientSecret: process.env.CLIENT_SECRET,
//     callbackURL: "http://localhost:3000/auth/google/story",
//     scope: ['profile', 'email'],
//   },
//   function(accessToken, refreshToken, profile, cb) {
//     // console.log(profile.displayName);
//     const userEmail = profile.emails[0].value;
//     // console.log(userEmail);
//     User.findOrCreate({ googleId: profile.id, 
//                         name: profile.displayName , 
//                         username: userEmail, 
//                         authType: "google" }, function (err, user) {
     
//       // console.log("User found or created:", user);
//       return cb(err, user);

//     });
    
//   }
// ));


app.use("/",userApp);

//Setting up the server.
const port =  3000;
app.listen(port, ()=>{
    console.log(`Server is running at port ${port}`);
});