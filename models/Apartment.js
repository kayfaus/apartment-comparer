const mongoose = require("mongoose");

// What an apartment looks like in the database
const apartmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, default: "" },
  image: { type: String, default: "" },
  rent: { type: Number, required: true },
  bedrooms: { type: Number, required: true },
  distance: { type: Number, required: true }, // miles to campus
});

module.exports = mongoose.model("Apartment", apartmentSchema);