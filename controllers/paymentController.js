// paymentModule.mjs

import stripeModule from 'stripe';
import passport from 'passport';
import 'dotenv/config';
import User from '../models/users.js';
import  Payment  from '../models/paymentModel.js';
import mongoose from 'mongoose';
import { createInterface } from 'readline';
import initializeTwilioClient from './twilioclient.js';

const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
const verifySid = process.env.verifySid;

const client = initializeTwilioClient(accountSid, authToken);



// const client = require("twilio")(accountSid, authToken);
let flag = 0;
let plan = " ";

const { STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY } = process.env;
// const stripe = stripeModule(STRIPE_SECRET_KEY);
const stripeClient = stripeModule(STRIPE_SECRET_KEY);



export function selectSubscription(req,res){
  if(req.isAuthenticated()){
    res.render("subscription");
  }
  else{
    res.redirect("/authenticate2");
  }
};

export function makepayment(req,res){
  // plan = req.body;
  plan = "starter";
  // console.log(plan);
  if(plan==="starter"){
    flag = 1;
    res.redirect("https://buy.stripe.com/test_5kA7vA4CKclC9Ms5km");
  }
  else if(plan==="value"){
    flag = 1;
    res.redirect("");
  }
  else{
    flag = 1;
    res.redirect("");
  }
};


const success = async (req, res) => {
  try {
    // console.log(flag);
    // console.log(plan);
    if(req.isAuthenticated()){
      const uname = req.user.username;
      const uid = req.user.id;
      //For "starter" package
      if(flag===1 && plan==="starter"){
        const payUser = await Payment.create({
        userId : uid,
        paymentAmount:16.97,
        paymentDate: new Date(),
        }); 
      // console.log(payUser.id);
        let objId = new mongoose.Types.ObjectId(payUser.id);
        await User.updateOne({
          username:uname
        },
        {
          $push:{
            paymentdetails : objId,
          },
        },
        {upsert : false, new : true},
        );

        const gemstoadd = 10;
        const parrotstoadd = 10;
        const user = await User.findOne({ username: uname });
        if (user) {
      
          user.gems += gemstoadd;
          user.parrots += parrotstoadd;
          await user.save(); // Save the updated user
      
        } else {
          console.log("User not found");
      // Handle the case where the user is not found
          return res.status(404).send("User not found");
        }
        res.redirect("/story");
        flag = 0;
      }
      //For "value" package
      else if(flag===1 && plan==="value"){
        const payUser = await Payment.create({
          userId : uid,
          paymentAmount:24.97,
          paymentDate: new Date(),
          }); 
        // console.log(payUser.id);
          let objId = new mongoose.Types.ObjectId(payUser.id);
          await User.updateOne({
            username:uname
          },
          {
            $push:{
              paymentdetails : objId,
            },
          },
          {upsert : false, new : true},
          );
  
          const gemstoadd = 20;
          const parrotstoadd = 20;
          const user = await User.findOne({ username: uname });
          if (user) {
        
            user.gems += gemstoadd;
            user.parrots += parrotstoadd;
            await user.save(); // Save the updated user
        
          } else {
            console.log("User not found");
        // Handle the case where the user is not found
            return res.status(404).send("User not found");
          }
          res.redirect("/story");
          flag = 0;
      }
      //For "premium" package
      else if(flag===1 && plan==="premium"){
        const payUser = await Payment.create({
          userId : uid,
          paymentAmount:44.97,
          paymentDate: new Date(),
          }); 
        // console.log(payUser.id);
          let objId = new mongoose.Types.ObjectId(payUser.id);
          await User.updateOne({
            username:uname
          },
          {
            $push:{
              paymentdetails : objId,
            },
          },
          {upsert : false, new : true},
          );
  
          const gemstoadd = 30;
          const parrotstoadd = 30;
          const user = await User.findOne({ username: uname });
          if (user) {
        
            user.gems += gemstoadd;
            user.parrots += parrotstoadd;
            await user.save(); // Save the updated user
        
          } else {
            console.log("User not found");
        // Handle the case where the user is not found
            return res.status(404).send("User not found");
          }
          res.redirect("/story");
          flag = 0;
      }
      else{
        res.send("pay first");
      }

    }else{
      res.redirect("/authenticate2");
    }
    
  } catch (error) {
      console.log(error.message);
      res.redirect("/error");
  }
};



const failure = async (req, res) => {
    try {
        res.render('payment_failure');
    } catch (error) {
        console.log(error.message);
    }
};


export { success, failure };

export function getr(req,res){
  res.render("random");
};

export function getotp(req,res){
res.redirect("/register");

client.verify.v2
  .services(verifySid)
  .verifications.create({ to: "+919836760380", channel: "sms" })
  .then((verification) => console.log(verification.status))
  .then(() => {

  const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});
    rl.question("Please enter the OTP:", (otpCode) => {
      client.verify.v2
        .services(verifySid)
        .verificationChecks.create({ to: "+919836760380", code: otpCode })
        .then((verification_check) => console.log(verification_check.status))
        .then(() => rl.close());
    });
  });
}