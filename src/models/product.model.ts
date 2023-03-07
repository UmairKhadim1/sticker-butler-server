/* eslint-disable no-unused-vars */
// Require Mongoose
const mongoose = require('mongoose');

// Define a schema
const { Schema } = mongoose;

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: false,
    default: '',
  },
  cat: {
    type: String,
    required: true,
  },
  price: { type: Number, required: true },
  updated_at: { type: Date, default: Date.now() },
  created_at: { type: Date, default: Date.now() },
});

module.exports = mongoose.model('product', ProductSchema);
export {};
