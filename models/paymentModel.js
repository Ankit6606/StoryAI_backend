// trigger a function to add gems, and parrot count, on sleecting a specific module

// functions to add parrot and gems to user profiles, after sucessful completion
// then execute them via controller page


// create a schema to put transaction history json in mongodb

import {mongoose, Schema} from 'mongoose';

const paymentSchema = new mongoose.Schema({
    userId : String,
    customerId : String,
    paymentAmount : Number,
    paymentDate : Date,
});

const Payment = new mongoose.model('Payment',paymentSchema);

export default Payment;