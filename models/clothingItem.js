const mongoose = require("mongoose");
const validator = require("validator");

const clothingItemSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 30 },
  weather: {
    required: [true, "Weather is required"],
    type: String,
    enum: {
      values: ["hot", "warm", "cold"],
      message:
        "{VALUE} is not a valid weather type. Valid types are: hot, warm, and cold",
    },
  },
  imageUrl: {
    type: String,
    required: [true, "The image URL field is required."],
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "Link is not Valid",
    },
  },
  owner: {
    required: [true, "Owner is required"],
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("clothingItems", clothingItemSchema);
