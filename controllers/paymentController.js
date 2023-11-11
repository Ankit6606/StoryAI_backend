// paymentModule.mjs

import stripeModule from 'stripe';

const { STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY } = process.env;
const stripe = stripeModule(STRIPE_SECRET_KEY);

const renderBuyPage = async (req, res) => {
    try {
        res.render('payment_buy', {
            key: STRIPE_PUBLISHABLE_KEY,
            amount: 100,
        });
    } catch (error) {
        console.log(error.message);
    }
};

const payment = async (req, res) => {
    try {
        // const customer = await stripe.customers.create({
        //     email: req.body.stripeEmail,
        //     source: req.body.stripeToken,
        //     name: 'John Doe',
        //     address: {
        //         line1: '1, Lorem ipsum',
        //         postal_code: '711101',
        //         city: 'Howrah',
        //         state: 'West Bengal',
        //         country: 'India',
        //     },
        // });

        // const charge = await stripe.charges.create({
        //     amount: req.body.amount * 100,
        //     description: req.body.productName,
        //     currency: 'INR',
        //     customer: customer.id,
        // });

        

        const session = await stripe.checkout.sessions.create({
            line_items: [
              {
                // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                price: 'price_1OBOkdSAr1NU1neQDeY1QS2A',
                quantity: 1,
              },
            ],
            mode: 'subscription',
            success_url: `http://localhost:3000/success`,
            cancel_url: `http://localhost:3000/failure`,
          });
          res.redirect('/success');
        
    } catch (error) {
        console.log(error.message);
        res.redirect('/failure');
    }
};

const success = async (req, res) => {
    try {
        res.render('payment_success');
    } catch (error) {
        console.log(error.message);
    }
};

const failure = async (req, res) => {
    try {
        res.render('payment_failure');
    } catch (error) {
        console.log(error.message);
    }
};

export { renderBuyPage, payment, success, failure };
