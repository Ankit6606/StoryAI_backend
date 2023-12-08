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



connectDatabase("mongodb://127.0.0.1:27017/story-app",{useNewUrlParser:true,useUnifiedTopology: true})
.then(()=>{
    console.log("Mongodb connected");
});

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
  async function(accessToken, refreshToken, profile, cb) {
    const userEmail = profile.emails[0].value;
    // console.log(profile);
  
    try {
      // Check if a user with the same Google ID or username already exists
      const existingUser = await User.findOne({ $or: [{ googleId: profile.id }, { username: userEmail }] });
  
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
  
        const savedUser = await newUser.save();
        // New user created successfully
        return cb(null, savedUser);
      }
    } catch (err) {
      console.error("Error during Google authentication:", err);
      return cb(err, null);
    }
  }));
  

app.use("/",userApp);

//Setting up the server.
const port =  3000;
app.listen(port, ()=>{
    console.log(`Server is running at port ${port}`);
});