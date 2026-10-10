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

// ----- Models -----
const apartmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, default: "" },
  rent: { type: Number, required: true },
  bedrooms: { type: Number, required: true },
  distance: { type: Number, required: true }, // miles to campus
  favorite: { type: Boolean, default: false },
});
const Apartment = mongoose.model("Apartment", apartmentSchema);

const reviewSchema = new mongoose.Schema({
  apartment: { type: mongoose.Schema.Types.ObjectId, ref: "Apartment", required: true },
  author: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
const Review = mongoose.model("Review", reviewSchema);

// ----- Apartment routes -----
app.get("/api/apartments", async (req, res) => {
  try {
    const apartments = await Apartment.find();
    res.json(apartments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/apartments", async (req, res) => {
  try {
    const apartment = await Apartment.create(req.body);
    res.status(201).json(apartment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.patch("/api/apartments/:id/favorite", async (req, res) => {
  try {
    const apt = await Apartment.findById(req.params.id);
    if (!apt) return res.status(404).json({ error: "Not found" });
    apt.favorite = !apt.favorite;
    await apt.save();
    res.json(apt);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ----- Review routes -----
app.get("/api/reviews", async (req, res) => {
  try {
    const filter = req.query.apartment ? { apartment: req.query.apartment } : {};
    const reviews = await Review.find(filter).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/api/reviews", async (req, res) => {
  try {
    const review = await Review.create(req.body);
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});