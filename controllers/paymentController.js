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
  const  boxId  = req.body.selectedBoxId;
  // console.log(boxId);
  // let redirectUrl;

  if (boxId === "basic"){
    res.redirect("/");
  }
  else if (boxId === "discover") {
    flag=1; 
    plan = boxId;
    res.redirect("https://buy.stripe.com/5kAbLg9Sk7BF8rS5kn"); // Set the redirect URL for "discover"
  } else if (boxId === "starter") {
    flag=1;
    plan = boxId;
    res.redirect("https://buy.stripe.com/5kAeXs5C4e030ZqcMQ"); // Set the redirect URL for "starter"      
  } else if (boxId === "value") {
    flag=1;
    plan = boxId;
    res.redirect("https://buy.stripe.com/5kA5mS2pSf47fUkdQV"); // Set the redirect URL for "value" 
  } else if (boxId === "premium") {
    flag=1; 
    plan = boxId;
    res.redirect("https://buy.stripe.com/aEUaHc1lO09d5fG6ou"); // Set the redirect URL for "premium"
  } else {
      // Handle unknown or invalid boxId
      res.redirect("/");
  }

  // if (redirectUrl) {
  //     res.json({ redirectUrl }); // Send the redirect URL as a response
  // } else {
  //     res.status(400).json({ error: 'Invalid boxId' });
  // }
};


const success = async (req, res) => {
  try {
    // console.log(flag);
    console.log(plan);
    if(req.isAuthenticated()){
      const uname = req.user.username;
      const uid = req.user.id;
      //For "discover" package
      if(flag===1 && plan==="discover"){
        const payUser = await Payment.create({
        userId : uid,
        paymentAmount:9.97,
        paymentDate: new Date(),
        }); 
      // console.log(payUser.id);
        let objId = new mongoose.Types.ObjectId(payUser.id);
        await User.updateOne({
          _id:uid
        },
        {
          $push:{
            paymentdetails : objId,
          },
        },
        {upsert : false, new : true},
        );

        const gemstoadd = 5;
        const parrotstoadd = 5;
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
        res.redirect("/");
        flag = 0;
      }
      //For "starter" package
      else if(flag===1 && plan==="starter"){
        const payUser = await Payment.create({
        userId : uid,
        paymentAmount:16.97,
        paymentDate: new Date(),
        }); 
      // console.log(payUser.id);
        let objId = new mongoose.Types.ObjectId(payUser.id);
        await User.updateOne({
          _id:uid
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
        res.redirect("/");
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
          res.redirect("/");
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
            _id:uid
          },
          {
            $push:{
              paymentdetails : objId,
            },
          },
          {upsert : false, new : true},
          );
  
          const gemstoadd = 40;
          const parrotstoadd = 40;
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
          res.redirect("/");
          flag = 0;
      }
      else{
        const message = `<h1>Pay First !!!<br><br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>


✨ Congratulations... You have unlocked an Easter Egg ✨</h1>`;

res.send(message);

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

