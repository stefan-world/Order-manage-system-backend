const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const productsSchema = new mongoose.Schema({
  number: {
    type: Number,
    default: 1
  },
  altnum: {
    type: Number,
    default: 1
  },
  name: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
  },
  origin: {
    type: String,
  },
  description: {
    type: String,
    default:""
  },
  price: {
    type: Number,
    required: true
  },
  barcode: {
    type: Number,
  },
  quantity: {
    type: String,
  },
  status: {
    type: String,
    default: "active"
  },
  supplier_id: {
    type: String,
    // required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  currency: {
    type: String,
    default: "$"
  }

});

module.exports = mongoose.model("Products", productsSchema);
