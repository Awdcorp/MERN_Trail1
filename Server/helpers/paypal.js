const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  client_id: process.env.PAYPAL_API_ID,
  client_secret: process.env.PAYPAL_API_SECRET,
});

module.exports = paypal;
