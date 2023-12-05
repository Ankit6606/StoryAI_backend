// paymentModule.mjs

import stripeModule from 'stripe';
import passport from 'passport';
import User from '../models/users.js';
import  Payment  from '../models/paymentModel.js';
import mongoose from 'mongoose';

let flag = 0;
let plan = " ";

const { STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY } = process.env;
// const stripe = stripeModule(STRIPE_SECRET_KEY);
const stripeClient = stripeModule(STRIPE_SECRET_KEY);

const renderBuyPage = async (req, res) => {
    try {
        res.render('payment_buy');
        
    } catch (error) {
        console.log(error.message);
    }
};


const handlePayment = async (req, res) => {
  const {  token, amount } = req.body; // Assuming you receive these from the client

  try {
    // Charge the user using Stripe
    const charge = await stripeClient.charges.create({
      amount: amount * 100, // Convert amount to cents
      currency: 'usd',
      source: token, // Token obtained from the client-side
      description: 'Story App Payment',
    });

    // If charge is successful, record payment in MongoDB
    const payment = new Payment({
      paymentAmount: amount,
    });

    await payment.save();

    res.status(200).json({ message: 'Payment successful' });
  } catch (err) {
    console.error('Error processing payment:', err);
    res.status(500).json({ error: 'Payment failed' });
  }
};

export function selectSubscription(req,res){
  // if(req.isAuthenticated()){
  //   res.render("subscription");
  // }
  // else{
  //   res.redirect("/authenticate2");
  // }
  res.render("subscription");
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
    if(flag===1 && plan==="starter"){
      const uname = req.user.username;
      const uid = req.user.id;
      const payUser = await Payment.create({
      userId : uid,
      paymentAmount:16.99,
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
    res.render("success");
    }
    else{
      res.send("pay first");
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

export { renderBuyPage, handlePayment, success, failure };

