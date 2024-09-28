import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
  },
  likedApartments: {
    type: Array<String>,
    default: [],
  },
});

// Check if the model already exists
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
