import express from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config';
import session from 'express-session';
import flash from 'connect-flash';
import passportLocalMongoose from 'passport-local-mongoose';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { userApp } from './routes/user.js';
import { connectDatabase } from './dbmongo.js';
import User from './models/users.js';
import cookieParser from 'cookie-parser'; // Import cookie-parser

// Import cors module
import cors from 'cors';

const app = express(); // For the main web application


app.use(cors({
  origin : "*",
  method : ['GET' , 'POST'],
  logLevel : 'dev'
}));

app.use(cookieParser()); // Place cookie-parser here

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawbody = buf;
  },
}));
app.set('view engine', 'ejs');

app.use(bodyParser.json());

app.use(session({
  secret: 'my secret',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

connectDatabase("mongodb://127.0.0.1:27017/story-app", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Mongodb connected");
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id)
    .then(function (user) {
      done(null, user); // Return found user
    })
    .catch(function (err) {
      done(err, null); // Return error if user retrieval fails
    });
});

passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "https://storyia.app/auth/google/story",
  scope: ['profile', 'email'],
},
  async function (accessToken, refreshToken, profile, cb) {
    const userEmail = profile.emails[0].value;

    try {
      const existingUser = await User.findOne({ $or: [{ googleId: profile.id }, { username: userEmail }] });

      if (existingUser) {
        return cb(null, existingUser);
      } else {
        const newUser = new User({
          googleId: profile.id,
          name: profile.displayName,
          username: userEmail,
          authType: "google"
        });

        const savedUser = await newUser.save();
        return cb(null, savedUser);
      }
    } catch (err) {
      console.error("Error during Google authentication:", err);
      return cb(err, null);
    }
  }));

// Middleware to detect language from Accept-Language header
app.use((req, res, next) => {
  const preferredLang = req.headers['accept-language']?.split(',')[0]?.toLowerCase();
  // Set default language to English if no preference or unsupported language
  res.locals.lang = preferredLang === 'fr' ? 'fr' : 'en';
  next();
});

// Middleware to set language based on URL parameter or cookie
app.use((req, res, next) => {
  const langFromUrl = req.params.lang || '';
  const langFromCookie = req.cookies.selectedLang || '';

  // Set the language based on the URL parameter, cookie, or default to English
  res.locals.lang = langFromUrl || langFromCookie || res.locals.lang;
  // Save the selected language in a cookie for future visits
  res.cookie('selectedLang', res.locals.lang, {
    maxAge: 365 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });

  next();
});

app.use("/", userApp);

// Setting up the server.
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
