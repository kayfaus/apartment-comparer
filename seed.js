require("dotenv").config();
const mongoose = require("mongoose");
const Apartment = require("./models/Apartment");

// USC-area student housing (distances are rough estimates in miles) - this can all be changed 
const apartments = [
    { name: "Greene Crossing", distance: 0.8 },
  { name: "The Mills", distance: 1.8 },
  { name: "The Hub at Columbia", distance: 0.3 },
  { name: "Gateway 737", distance: 0.7 },
  { name: "The Standard", distance: 0.9 },
  { name: "VERVE Columbia", distance: 1.2 },
  { name: "Olympia", distance: 2.5 },
  { name: "Park Place", distance: 0.4 },
  { name: "Sawyer on Lincoln", distance: 3.1 },
];

// Random whole number between min and max (inclusive)
function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);

  // Clear out old apartments so there are no duplicates
  await Apartment.deleteMany({});

  const docs = apartments.map((apt) => ({
    ...apt,
    address: "Columbia, SC",
    rent: Math.round(randomBetween(800, 1700) / 25) * 25, // nearest $25
    bedrooms: randomBetween(1, 5),
  }));

  await Apartment.insertMany(docs);
  console.log(`Added ${docs.length} apartments`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seeding failed:", err.message);
  process.exit(1);
});