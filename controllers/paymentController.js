// paymentModule.mjs

import stripePackage from 'stripe';
// import passport from 'passport';
import 'dotenv/config';
import User from '../models/users.js';
import  Payment  from '../models/paymentModel.js';
import mongoose from 'mongoose';

const stripe = stripePackage('sk_test_51OBAcySAr1NU1neQ0gaIwVpXIt1mAP7rzIKPijaDdTMvonNXhvFf8CSRxhZdm1zT1DU0WsxmVHth1dKqXxZxdbCK00VacTfNJP');
const STRIPE_ENDPOINT_SECRET = process.env.STRIPE_ENDPOINT_SECRET;
// const client = require("twilio")(accountSid, authToken);
let flag = 0;
let plan = " ";
let uid = " ";

 



export function selectSubscription(req,res){
  if(req.isAuthenticated()){
    if(req.user.phoneNumber){
      uid = req.user.id;
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

export const makepayment = async (req, res) => {
  const  selectedBoxId  = req.body.selectedBoxId;
  // console.log('Received planId:', selectedBoxId);
  try {

    let selectedpriceId;
    switch(selectedBoxId){
      case 'basic':
        res.redirect("/");
        return;
      case 'discover':
        selectedpriceId = process.env.DISCOVER_PLAN_ID;
        break;
      case 'starter':
        selectedpriceId = process.env.STARTER_PLAN_ID;
        break;
      case 'value':
        selectedpriceId = process.env.VALUE_PLAN_ID;
        break;
      case 'premium':
        selectedpriceId = process.env.PREMIUM_PLAN_ID;
        break;
      default:
        console.log('Invalid planId:', selectedBoxId);
        res.status(400).json({ error: 'Invalid plan selection' });
        return;
    }
    // console.log(selectedpriceId);
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{
        price: selectedpriceId, // Use the Stripe Price ID associated with each plan
        quantity: 1,
      }],
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/failure',
    });

    res.redirect( session.url ); // Send the Stripe Checkout URL to the frontend
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
};


const success = async (req, res) => {
  try {
      res.render('success');
  } catch (error) {
      console.log(error.message);
  }
};

export const manageInvoice = async (req, res) => {
  const payload = req.rawbody;
  // console.log('Webhook Payload:', payload);
  const sig = req.headers['stripe-signature'];

  // Check if the Stripe-Signature header is present
  if (!sig) {
    console.error('Webhook Error: Missing Stripe-Signature header');
    return res.status(400).send('Webhook Error: Missing Stripe-Signature header');
  }

  // Extract timestamp and signatures
  // const [timestamp, ...signatures] = sig.split(',');

  // console.log('Timestamp:', timestamp);
  // console.log('Signatures:', signatures);

  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, STRIPE_ENDPOINT_SECRET);
  } catch (err) {
    console.error('Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  
  // console.log('Webhook Event Type:', event.type);

  // Handle the event
  switch (event.type) {
    case 'invoice.payment_succeeded':
      // Log relevant data for debugging
      console.log(uid);
      console.log('Payment Succeeded Event Received:', {
        customerId: event.data.object.customer,
        subscriptionId: event.data.object.subscription,
      });
  
      // Retrieve user by Stripe customer ID
      
      const customerId = event.data.object.customer;
      // const user = await User.findOne({ 'paymentdetails.customerId': customerId });
  
      // if (user) {
      //   // Increment gems and parrots based on the subscription plan
      //   // Log the user's current gems and parrots
      //   console.log('User Before Update:', {
      //     gems: user.gems,
      //     parrots: user.parrots,
      //   });
  
      //   // Update user document accordingly
      //   user.gems += 10;
      //   user.parrots += 10;
  
      //   // Save the user document
      //   await user.save();
  
      //   // Log the user's updated gems and parrots
      //   console.log('User After Update:', {
      //     gems: user.gems,
      //     parrots: user.parrots,
      //   });
      // } else {
      //   // User not found, create a new paymentdetails entity
      //   const newPaymentDetail = {
      //     customerId: customerId,
      //     // Add other relevant fields as needed
      //   };
  
      //   // Push the new paymentdetails entity to the paymentdetails array
      //   user.paymentdetails.push(newPaymentDetail)
      //     .then(()=>{
      //       console.log("SUBSCRIPTION ADDED");
      //     }).catch((err)=>{
      //       console.log(err);
      //     })
  
      //   // Increment gems and parrots based on the subscription plan
      //   user.gems += 10;
      //   user.parrots += 10;
  
      //   // Save the user document
      //   await user.save();
  
        // Log the user's updated gems and parrots
      //   console.log('New User Created and Updated:', {
      //     gems: user.gems,
      //     parrots: user.parrots,
      //   });
      // }
  
      break;
    // Handle other event types as needed
  
  
    
    case "invoice.payment_failed":
      console.log("Invoice generation is not successful");
      break;
    // Handle other event types as needed
  }

  // Respond to the webhook
  res.json({ received: true });
};

// export function makepayment(req,res){
//   const  {planId}  = req.body;
//   // console.log(planId);
//   // let redirectUrl;

//   if (planId === "basic"){
//     res.redirect("/");
//   }
//   else if (planId === "discover") {
//     flag=1; 
//     plan = planId;
//     res.redirect("https://buy.stripe.com/5kAbLg9Sk7BF8rS5kn"); // Set the redirect URL for "discover"
//   } else if (planId === "starter") {
//     flag=1;
//     plan = planId;
//     res.redirect("https://buy.stripe.com/5kAeXs5C4e030ZqcMQ"); // Set the redirect URL for "starter"      
//   } else if (planId === "value") {
//     flag=1;
//     plan = planId;
//     res.redirect("https://buy.stripe.com/5kA5mS2pSf47fUkdQV"); // Set the redirect URL for "value" 
//   } else if (planId === "premium") {
//     flag=1; 
//     plan = planId;
//     res.redirect("https://buy.stripe.com/aEUaHc1lO09d5fG6ou"); // Set the redirect URL for "premium"
//   } else {
//       // Handle unknown or invalid planId
//       res.redirect("/");
//   }

//   // if (redirectUrl) {
//   //     res.json({ redirectUrl }); // Send the redirect URL as a response
//   // } else {
//   //     res.status(400).json({ error: 'Invalid planId' });
//   // }
// };


// const success = async (req, res) => {
//   try {
//     // console.log(flag);
//     console.log(plan);
//     if(req.isAuthenticated()){
//       const uname = req.user.username;
//       const uid = req.user.id;
//       //For "discover" package
//       if(flag===1 && plan==="discover"){
//         const payUser = await Payment.create({
//         userId : uid,
//         paymentAmount:9.97,
//         paymentDate: new Date(),
//         }); 
//       // console.log(payUser.id);
//         let objId = new mongoose.Types.ObjectId(payUser.id);
//         await User.updateOne({
//           _id:uid
//         },
//         {
//           $push:{
//             paymentdetails : objId,
//           },
//         },
//         {upsert : false, new : true},
//         );

//         const gemstoadd = 5;
//         const parrotstoadd = 5;
//         const user = await User.findOne({ username: uname });
//         if (user) {
//           user.gems += gemstoadd;
//           user.parrots += parrotstoadd;
//           await user.save(); // Save the updated user
//         } else {
//           console.log("User not found");
//       // Handle the case where the user is not found
//           return res.status(404).send("User not found");
//         }
//         res.redirect("/");
//         flag = 0;
//       }
//       //For "starter" package
//       else if(flag===1 && plan==="starter"){
//         const payUser = await Payment.create({
//         userId : uid,
//         paymentAmount:16.97,
//         paymentDate: new Date(),
//         }); 
//       // console.log(payUser.id);
//         let objId = new mongoose.Types.ObjectId(payUser.id);
//         await User.updateOne({
//           _id:uid
//         },
//         {
//           $push:{
//             paymentdetails : objId,
//           },
//         },
//         {upsert : false, new : true},
//         );

//         const gemstoadd = 10;
//         const parrotstoadd = 10;
//         const user = await User.findOne({ username: uname });
//         if (user) {
      
//           user.gems += gemstoadd;
//           user.parrots += parrotstoadd;
//           await user.save(); // Save the updated user
      
//         } else {
//           console.log("User not found");
//       // Handle the case where the user is not found
//           return res.status(404).send("User not found");
//         }
//         res.redirect("/");
//         flag = 0;
//       }
//       //For "value" package
//       else if(flag===1 && plan==="value"){
//         const payUser = await Payment.create({
//           userId : uid,
//           paymentAmount:24.97,
//           paymentDate: new Date(),
//           }); 
//         // console.log(payUser.id);
//           let objId = new mongoose.Types.ObjectId(payUser.id);
//           await User.updateOne({
//             username:uname
//           },
//           {
//             $push:{
//               paymentdetails : objId,
//             },
//           },
//           {upsert : false, new : true},
//           );
  
//           const gemstoadd = 20;
//           const parrotstoadd = 20;
//           const user = await User.findOne({ username: uname });
//           if (user) {
        
//             user.gems += gemstoadd;
//             user.parrots += parrotstoadd;
//             await user.save(); // Save the updated user
        
//           } else {
//             console.log("User not found");
//         // Handle the case where the user is not found
//             return res.status(404).send("User not found");
//           }
//           res.redirect("/");
//           flag = 0;
//       }
//       //For "premium" package
//       else if(flag===1 && plan==="premium"){
//         const payUser = await Payment.create({
//           userId : uid,
//           paymentAmount:44.97,
//           paymentDate: new Date(),
//           }); 
//         // console.log(payUser.id);
//           let objId = new mongoose.Types.ObjectId(payUser.id);
//           await User.updateOne({
//             _id:uid
//           },
//           {
//             $push:{
//               paymentdetails : objId,
//             },
//           },
//           {upsert : false, new : true},
//           );
  
//           const gemstoadd = 40;
//           const parrotstoadd = 40;
//           const user = await User.findOne({ username: uname });
//           if (user) {
        
//             user.gems += gemstoadd;
//             user.parrots += parrotstoadd;
//             await user.save(); // Save the updated user
        
//           } else {
//             console.log("User not found");
//         // Handle the case where the user is not found
//             return res.status(404).send("User not found");
//           }
//           res.redirect("/");
//           flag = 0;
//       }
//       else{
//         const message = `<h1>Pay First !!!<br><br>
// <br>
// <br>
// <br>
// <br>
// <br>
// <br>
// <br>


// ✨ Congratulations... You have unlocked an Easter Egg ✨</h1>`;

// res.send(message);

//       }

//     }else{
//       res.redirect("/authenticate2");
//     }
    
//   } catch (error) {
//       console.log(error.message);
//       res.redirect("/error");
//   }
// };



const failure = async (req, res) => {
    try {
        res.render('payment_failure');
    } catch (error) {
        console.log(error.message);
    }
};


export { success, failure };

