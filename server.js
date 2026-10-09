require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.json());

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

// Define what an apartment looks like
const apartmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rent: { type: Number, required: true },
  bedrooms: { type: Number, required: true },
  distance: { type: Number, required: true }, // miles to campus
});

const Apartment = mongoose.model("Apartment", apartmentSchema);

// Get all apartments
app.get("/api/apartments", async (req, res) => {
  const apartments = await Apartment.find();
  res.json(apartments);
});

// Add a new apartment
app.post("/api/apartments", async (req, res) => {
  try {
    const apartment = await Apartment.create(req.body);
    res.status(201).json(apartment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});