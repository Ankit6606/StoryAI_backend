// paymentModule.mjs

import stripeModule from 'stripe';
import User from '../models/users.js';
import  Payment  from '../models/paymentModel.js';
import mongoose from 'mongoose';

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



const success = async (req, res) => {
  try {
    const uname = req.user.username;
    const uid = req.user.id;
    const payUser = await Payment.create({
      userId : uid,
      paymentAmount:16.99,
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


// {
//   "_id": "eaf6b250-4438-4cc8-89f1-f4444557149b",
//   "audio_duration": 18.437,
//   "audio_path": "/content/test.mp3",
//   "story": "Once upon a time, in the enchanting world of Asteroidia, there lived a kind-hearted dinosaur named Dino. Dino was a plucky Stegosaurus, with bright green scales and a heart full of compassion. One fateful day, an asteroid shower rained down upon the land, causing panic and sadness among the inhabitants. Dino knew he had to do something to help.\n\nWith determination in his eyes, Dino embarked on a daring mission to gather all the scared and lonely dinosaurs in Asteroidia. He knew that together, they could find safety and comfort. Dino traveled from one corner of the land to another, using his kind words and gentle nature to convince the dinosaurs to join him.\n\nAs Dino gathered more and more dinosaurs, he faced a new twist in his plan. The asteroid shower was intensifying, making it harder for the dinosaurs to move quickly. The ground was shaking, and the sky was filled with fiery rocks. But Dino's determination never wavered.\n\nUsing his strong tail, Dino created a shield for the smaller dinosaurs, protecting them from the falling asteroids. He led them through treacherous paths, guiding them with his deep knowledge of the land. Dino's bravery and quick thinking gave hope to all the dinosaurs, filling their hearts with gratitude.\n\nFinally, after a long and arduous journey, Dino and the dinosaurs reached a hidden cave deep within the mountains. It was a sanctuary away from the chaos of the asteroid shower. The dinosaurs found solace and safety within its walls.\n\nAs the last asteroid fell, Dino looked at his fellow dinosaurs, their eyes filled with gratitude and admiration. He had not only saved them from the asteroid shower but had also shown them the power of kindness. In that moment, Dino knew that he had made a difference in their lives.\n\nAnd so, in the enchanting world of Asteroidia, Dino's daring dash became a legendary tale of bravery and kindness that was passed down through generations.",
//   "thumb_img_path": "https://oaidalleapiprodscus.blob.core.windows.net/private/org-5PqYKPUMeiGA2HStd9GOGCiD/user-9mEgRWYUi8P7LFXzUS5WHHTh/img-0Pj82PSWXOIP2GBHesDksMkj.png?st=2023-11-20T11%3A58%3A48Z&se=2023-11-20T13%3A58%3A48Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-11-20T05%3A47%3A56Z&ske=2023-11-21T05%3A47%3A56Z&sks=b&skv=2021-08-06&sig=QhYMrgyA9tAg83NFqHxquWxR1K33vdSolQjQ9dIohk4%3D",
//   "timestamp": "Mon, 20 Nov 2023 12:58:48 GMT",
//   "title": "Dino's Daring Dash",
//   "userId": "Admin_Test"
// }

// Success get request

      // if (req.isAuthenticated()) {
      //     const userId = req.user._id; // Assuming user's ID is stored in _id field
      //     console.log(userId);
      //     const paymentData = {
      //         userId: userId,
      //         paymentAmount: 16.97,
      //         paymentDate: new Date(), // You can set the payment date here
      //     };

      //     Payment.create(paymentData)
      //     .then(() => {
      //         res.render("success");
      //     })
      //     .catch((err) => {
      //         console.log(err);
      //         res.redirect("/error");
      //     });

      //     // Find the payment record for the current user
      //     // Payment.findOne({ userId: userId })
      //     //     .then((foundPayment) => {
      //     //         if (foundPayment) {
      //     //             // If the payment record exists, update it
      //     //             foundPayment.paymentAmount = paymentData.paymentAmount;
      //     //             foundPayment.paymentDate = paymentData.paymentDate;

      //     //             foundPayment.save()
      //     //                 .then(() => {
      //     //                     res.render("success");
      //     //                 })
      //     //                 .catch((err) => {
      //     //                     console.log(err);
      //     //                     res.redirect("/error");
      //     //                 });
      //     //         } else {
      //     //             // If the payment record doesn't exist, create a new one
      //     //             Payment.create(paymentData)
      //     //                 .then(() => {
      //     //                     res.render("success");
      //     //                 })
      //     //                 .catch((err) => {
      //     //                     console.log(err);
      //     //                     res.redirect("/error");
      //     //                 });
      //     //         }
      //     //     })
      //     //     .catch((err) => {
      //     //         console.log(err);
      //     //         res.redirect("/error");
      //     //     });
      // } else {
      //     res.redirect("/login");
      // }i