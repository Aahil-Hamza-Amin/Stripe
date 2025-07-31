const express = require("express");
const session = require('./controllers/checkoutController');

const app = express();

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index.ejs");
});

// Routes
app.post('/checkout', session.checkoutSession);
app.get('/success', session.success);
app.get('/cancel', session.cancel);

module.exports = app;
