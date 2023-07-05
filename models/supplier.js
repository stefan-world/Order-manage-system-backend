const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const suppliersSchema = new mongoose.Schema({
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
    required:true
  },
  mobile: {
    type: String,
    required:true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true,
  },
  phone: {
    type: String,
    required:true
  },
  country: {
    type: String,
    required:true
  },
  state: {
    type: String,
    required:true
  },
  city: {
    type: String,
    required:true
  },
  postcode: {
    type: String,
    required:true
  },
  address: {
    type: String,
    required:true
  },
  status: {
    type: String,
    default: "active"
  },
  account_id: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Suppliers", suppliersSchema);
