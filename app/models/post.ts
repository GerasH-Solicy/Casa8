import mongoose from "mongoose";

const apartmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  monthlyRent: {
    type: Number,
    required: true,
  },
  propertyType: {
    type: String,
    enum: ["Apartment", "House", "Loft", "Studio", "Townhouse"],
    required: true,
  },
  bedrooms: {
    type: Number,
    required: true,
  },
  bathrooms: {
    type: Number,
    required: true,
  },
  squareFootage: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userEmail: {
    type: String,
    required: true
  },
});

// Check if the model already exists
const Apartment = mongoose.models.Apartment || mongoose.model("Apartment", apartmentSchema);

export default Apartment;
