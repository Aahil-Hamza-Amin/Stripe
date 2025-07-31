const stripe = require('./../utils/stripe')

exports.checkoutSession = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ["US", "PK"],
      },
      success_url: `${process.env.BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL}/cancel`,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Nest.js Book",
            },
            unit_amount: 30 * 100,
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'SQL T-shirt'
            },
            unit_amount: 15 * 100
          },
          quantity: 2
        }
      ],
    });

    res.redirect(session.url);
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error: error.message,
    });
  }
};

exports.success = async (req, res) => {
  const result = await Promise.all([
    stripe.checkout.sessions.retrieve(req.query.session_id, {
      expand: ["payment_intent.payment_method"],
    }),
    stripe.checkout.sessions.listLineItems(req.query.session_id),
  ]);

  console.log(result);

  res.status(200).send("Your Payment is Successful");
};
exports.cancel = (req, res) => {
  res.redirect("/");
};
