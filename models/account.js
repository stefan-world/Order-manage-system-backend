const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const accountsSchema = new mongoose.Schema({
  number: {
    type: Number,
    default: 1
  },
  altnum: {
    type: Number,
    default: 1
  },
  account_name: {
    type: String,
    required:true
  },
  primary_contact_firstname: {
    type: String,
    required:true
  },
  primary_contact_lastname: {
    type: String,
    required:true
  },
  primary_contact_mobile: {
    type: String,
    required:true
  },
  primary_contact_email: {
    type: String,
    required: true,
  },
  address_line1: {
    type: String,
    required:true
  },
  address_line2: {
    type: String,
    required:true
  },
  city: {
    type: String,
    required:true
  },
  state: {
    type: String,
    required:true
  },
  postcode: {
    type: String,
    required:true
  },
  country: {
    type: String,
    required:true
  },
  company_email: {
    type: String,
    required:true
  },
  status: {
    type: String,
    required:true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Accounts", accountsSchema);
