const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: "New product",
  },
  discription: {
    type: String,
    required: true,
    default: "product discription",
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  discountPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  shopId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Product", productSchema);
