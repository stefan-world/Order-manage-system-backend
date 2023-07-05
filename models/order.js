const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const ordersSchema = new mongoose.Schema({
  number: {
    type: Number,
    default: 1
  },
  altnum: {
    type: Number,
    default: 1
  },
  products_id: {
    type: [String],
    required: true
  },
  products_quantity:{
    type: [Number],
    default: true
  },
  file: {
    type: String,
    // required: true
  },
  status: {
    type: String,
    default: 'progress'
  },
  supplier_id: {
    type: String,
    required: true
  },
  account_id: {
    type: String,
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },

});

module.exports = mongoose.model("Orders", ordersSchema);
