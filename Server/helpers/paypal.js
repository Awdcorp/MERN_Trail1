const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  client_id: "AfruSlXpEOtAkc_nk1-wQ8YvxTsfAVxfPQzLnQVX3F1T1uZIfzrzyTywQkl3z4pt5Gh38aWbOJabGl7w",
  client_secret: "EAhUONk4IzbYdGcbA4bNeFNx7kpUbl8UqMASM8gPhtdER_KAHc3QqQVsb5FhFdiAOuPVOsWVrqwV9wnk",
});

module.exports = paypal;
