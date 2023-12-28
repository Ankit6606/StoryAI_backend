// paymentModule.mjs

import stripeModule from 'stripe';
// import passport from 'passport';
import 'dotenv/config';
import User from '../models/users.js';
import  Payment  from '../models/paymentModel.js';
import mongoose from 'mongoose';


// const client = require("twilio")(accountSid, authToken);
let flag = 0;
let plan = " ";

const { STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY } = process.env;
// const stripe = stripeModule(STRIPE_SECRET_KEY);
const stripeClient = stripeModule(STRIPE_SECRET_KEY);



export function selectSubscription(req,res){
  if(req.isAuthenticated()){
    if(req.user.phoneNumber){
      res.render("subscription",{
        gems : req.user.gems,
        parrots: req.user.parrots
      });
    }
    else{
      res.redirect("/phonenumber");
    }
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
    res.redirect("https://buy.stripe.com/4gw2aG1lO5txaA0dQQ");
  }
  else if(plan==="value"){
    flag = 1;
    res.redirect("https://buy.stripe.com/7sIg1w6G87BFdMc5kl");
  }
  else if(plan==="premium"){
    flag = 1;
    res.redirect("https://buy.stripe.com/4gw9D89Sk2hleQgdQS");
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

