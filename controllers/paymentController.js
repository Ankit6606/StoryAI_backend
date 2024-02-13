// paymentModule.mjs

import stripePackage from 'stripe';
// import passport from 'passport';
import 'dotenv/config';
import User from '../models/users.js';
import  Payment  from '../models/paymentModel.js';
import mongoose from 'mongoose';

const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);
const STRIPE_ENDPOINT_SECRET = process.env.STRIPE_ENDPOINT_SECRET;
// const client = require("twilio")(accountSid, authToken);
let plan = " ";
let uid = " ";
let gemsToAdd = 0;
let parrotsToAdd = 0;

 



export function selectSubscription(req,res){
  if(req.isAuthenticated()){
    if(req.user.phoneNumber){
      uid = req.user.id;
      const userSubscriptionPlan = req.user.subscriptionPlan; 

      const boxIds = ["basic", "discover", "starter", "value", "premium"];
      res.render("subscription",{
        gems : req.user.gems,
        parrots: req.user.parrots,
        boxIds,userSubscriptionPlan
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
export function selectSubscriptionFr(req,res){
  if(req.isAuthenticated()){
    if(req.user.phoneNumber){
      uid = req.user.id;
      res.render("fr/subscription",{
        gems : req.user.gems,
        parrots: req.user.parrots
      });
    }
    else{
      res.redirect("/fr/phonenumber");
    }
  }
  else{
    res.redirect("/fr/authenticate2");
  }
};


export const makepayment = async (req, res) => {
  if(req.isAuthenticated()){
    if(req.user.phoneNumber){
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
        plan = 'discover';
        break;
      case 'starter':
        selectedpriceId = process.env.STARTER_PLAN_ID;
        plan = 'starter';
        break;
      case 'value':
        selectedpriceId = process.env.VALUE_PLAN_ID;
        plan = 'value';
        break;
      case 'premium':
        selectedpriceId = process.env.PREMIUM_PLAN_ID;
        plan = 'premium';
        break;
      default:
        console.log('Invalid planId:', selectedBoxId);
        res.status(400).json({ error: 'Invalid plan selection' });
        return;
    }

    if (req.user.subscriptionPlan !== "basic") {
      const paidUser = await Payment.findOne({userid : uid, active : "true"}); 
      if(paidUser){
      try {
        // Retrieve the user's current subscription details from Stripe
        const subscription = await stripe.subscriptions.retrieve(paidUser.subscriptionId);
        
        // Cancel the current subscription
        await stripe.subscriptions.update(paidUser.subscriptionId, {
          cancel_at_period_end: false, // Cancel instantly
        });
        
        paidUser.active = "false";
        await paidUser.save();
        // Create a new subscription for the upgraded plan
        const session = await stripe.checkout.sessions.create({
          mode: 'subscription',
          payment_method_types: ['card'],
          line_items: [{
            price: selectedpriceId,
            quantity: 1,
          }],
          success_url: 'http://localhost:3000/success',
          cancel_url: 'http://localhost:3000/failure',
        });
        // Redirect the user to the checkout session for the new plan
        res.redirect(session.url);
      }
       catch (error) {
        console.error('Error upgrading subscription:', error);
        res.status(500).json({ error: 'Failed to upgrade subscription' });
      }
    }
  }
    else{
    // console.log(selectedpriceId);
 
    // if (req.user.paymentdetails && req.user.paymentdetails.length > 0) {
    //   // Get the last payment detail's customerId if it exists
    //   const lastPaymentDetail = req.user.paymentdetails[0];
    //   if (lastPaymentDetail && lastPaymentDetail.userId) {
    //     const customerId = lastPaymentDetail.userId;
    //     // Use the customerId in your logic as needed
    //     console.log('Customer ID:', customerId);
    //   } else {
    //     console.error('Last payment detail does not have a customer ID');
    //   }
    // } else {
      // console.error('User does not have payment details');

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
  }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
    }else{
      res.redirect("/phonenumber");
    }
  }else{
    res.redirect("/authenticate2");
  }
  
};


const success = async (req, res) => {
  try {
      res.render('success');
  } catch (error) {
      console.log(error.message);
  }
};



//----Subscription Cancel------//

export const cancelSubscription = async (req, res) => {
  try {
    if(req.isAuthenticated()){
      if(req.user.phoneNumber){
        // Check if the user has an active subscription
      const subscribedUser  = await Payment.findOne({userId : uid, active : "true"});
      if(subscribedUser){
      // Retrieve the subscription details from Stripe
      const subscription = await stripe.subscriptions.retrieve(subscribedUser.subscriptionId);

      // Check if the subscription is cancelable
      if (subscription.status === 'active') {
        // Cancel the subscription
        await stripe.subscriptions.update(subscribedUser.subscriptionId, {
          cancel_at_period_end: false, // Cancel instantly
        });
        const user = await User.findOne({_id : uid});
        if(user){
          if(user.stories){
          user.gems = 0;
          user.parrots = 0;
          }else{
            user.gems = 1;
            user.parrots = 1;
          }
          user.subscriptionPlan = "basic";
          await user.save();
        }else{
          console.log("User is not found.");
          res.redirect("/subscribe");
        }
        subscribedUser.active = "false";
        await subscribedUser.save();
        res.redirect("/");
      } else {
        // res.status(400).json({ error: 'Subscription is not active' });
        const errorMsg = "You don't have any current active subscription.";
        const script  = `<script> alert("${errorMsg}"); windows.location.href = "/subscribe"; </script>`;
        return res.send(script);
      }
    } else {
      // res.status(400).json({ error: 'User does not have an active subscription' });
      const errorMsg = "First you need to subscribe to one of the plans.";
      const script  = `<script> alert("${errorMsg}");windows.location.href = "/subscribe"; </script>`;
      return res.send(script);  
    }
      }else{
        res.redirect("/phonenumber");
      }
    }else{
      res.redirect("/authenticate2");
    }  
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
};




//--------Webhook Stripe----------//


export const manageInvoice = async (req, res) => {
  const payload = req.rawbody;
  // console.log('Webhook Payload:', payload);
  const sig = req.headers['stripe-signature'];

  if (!sig) {
    console.error('Webhook Error: Missing Stripe-Signature header');
    return res.status(400).send('Webhook Error: Missing Stripe-Signature header');
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, STRIPE_ENDPOINT_SECRET);
  } catch (err) {
    console.error('Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  
  // console.log('Webhook Event Type:', event.type);

  switch (event.type) {
    case 'invoice.payment_succeeded':
      const subscriptionId = event.data.object.subscription;
      const customerId = event.data.object.customer;
      const amountPaid = event.data.object.amount_paid;
      const payUser = await Payment.create({
          userId : uid,
          customerId : customerId,
          active : "true",
          subscriptionId : subscriptionId,
          paymentAmount:amountPaid/100,
          paymentDate: new Date(),
      }); 
      // console.log(payUser.id);
      let objId = new mongoose.Types.ObjectId(payUser.id);

      await User.updateOne(
        { _id: uid },
        {
          $push: {
            paymentdetails: objId,
          },
          $set: {
            subscriptionPlan: plan,
          },
        },
        { upsert: false, new: true }
      );
      

      if(amountPaid==997){
        gemsToAdd = 5;
        parrotsToAdd = 5;
      }else if(amountPaid==1697){
        gemsToAdd = 10;
        parrotsToAdd = 10;
      }else if(amountPaid==2497){
        gemsToAdd = 20;
        parrotsToAdd = 20;
      }else{
        gemsToAdd = 40;
        parrotsToAdd = 40;
      }

  
      const user = await User.findOne({ 'paymentdetails.customerId': customerId });
      if (user) {
        user.gems += gemsToAdd;
        user.parrots += parrotsToAdd;
        await user.save(); // Save the updated user
      } else {
        console.log("User not found");
    // Handle the case where the user is not found
        return res.status(404).send("User not found");
      }
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





//FRENCH

export const manageInvoiceFr = async (req, res) => {
  const payload = req.rawbody;
  // console.log('Webhook Payload:', payload);
  const sig = req.headers['stripe-signature'];

  // Check if the Stripe-Signature header is present
  if (!sig) {
    console.error('Webhook Error: Missing Stripe-Signature header');
    return res.status(400).send('Webhook Error: Missing Stripe-Signature header');
  }

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
      // console.log(uid);
      console.log('Payment Succeeded Event Received:', {
        customerId: event.data.object.customer,
        subscriptionId: event.data.object.subscription,
      });
  
      // Retrieve user by Stripe customer ID
      
      const customerId = event.data.object.customer;
      const amountPaid = event.data.object.amount_paid;
      const payUser = await Payment.create({
          userId : uid,
          customerId : customerId,
          paymentAmount:amountPaid/100,
          paymentDate: new Date(),
      }); 
      // console.log(payUser.id);
      let objId = new mongoose.Types.ObjectId(payUser.id);

      await User.updateOne(
        { _id: uid },
        {
          $push: {
            paymentdetails: objId,
          },
          $set: {
            subscriptionPlan: plan,
          },
        },
        { upsert: false, new: true }
      );
      

  
      const user = await User.findOne({ 'paymentdetails.customerId': customerId });

      if (user) {
        user.gems += gemsToAdd;
        user.parrots += parrotsToAdd;
        await user.save(); // Save the updated user
      } else {
        console.log("User not found");
    // Handle the case where the user is not found
        return res.status(404).send("User not found");
      }
  
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

