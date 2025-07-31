const express = require('express');
const dotenv = require('dotenv');
const { name } = require('ejs');
dotenv.config({path: './config.env'});
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res)=>{
    // res.json({data: 'hamza'})
    res.render('index.ejs')
})

app.post('/checkout', async (req, res)=>{
    const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        shipping_address_collection: 
            {
                allowed_countries: ['US', 'PK']
            },
        success_url: `${process.env.BASE_URL}/complete?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.BASE_URL}/cancel`,
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Node.js And Express book'
                    },
                    unit_amount: 50 * 100
                },
                quantity: 1
            },
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'JavaScript T-shirt'
                    },
                    unit_amount: 20 * 100
                },
                quantity: 2
            }
        ]
    })

    res.redirect(session.url)
})

app.get('/complete', async(req, res)=>{
    const result = await Promise.all([
        stripe.checkout.sessions.retrieve(req.query.session_id, {expand: ['payment_intent.payment_method']}),
        stripe.checkout.sessions.listLineItems(req.query.session_id)
    ])
    
    console.log(JSON.stringify(result));
    
    res.send('Your payment is completed')
})

app.get('/cancel', (req, res)=>{
    res.redirect('/')
})

app.listen(process.env.PORT || 3001, ()=>{
console.log(`Server is started at http://localhost:${process.env.PORT}`);
})