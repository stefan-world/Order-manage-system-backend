
const mongoose = require("mongoose");
const Accounts = mongoose.model("Accounts");
const Users = mongoose.model("Users");

require("dotenv").config({ path: ".variables.env" });

exports.create = async (req, res) => {
  try {

    let {
      account_name, primary_contact_firstname, primary_contact_lastname, primary_contact_mobile, 
      primary_contact_email, address_line1, address_line2, city, state, postcode, country, company_eamil, status
    } = req.body;

    const allAccounts = await Accounts.find();
    const number = allAccounts.length + 1;
    const altnum = number;

    const newAccount = new Accounts({
      number, altnum, account_name, primary_contact_firstname, primary_contact_lastname, primary_contact_mobile, 
      primary_contact_email, address_line1, address_line2, city, state, postcode, country, company_eamil, status
    });

    const saveAccount = await newAccount.save();

    return res.status(200).json({
      success: true,
      message: "successfully created! Please check your accounts list!"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.list = async (req, res) => {
  try {
      var accounts = await Accounts.find();

    if (!accounts)
      return res.status(400).json({
        message: "Accounts doesn't exist."
      });

    return res.status(200).json({
      accounts: accounts
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const number = await Accounts.findOne({ _id: id });
    const accounts = await Accounts.find();

    const i = number.number;

    const result = await Accounts.findOneAndDelete({ _id: id });

    if (!result)
      return res.status(400).json({
        message: "It doesn't exist."
      });

    for (j = i + 1; j <= accounts.length; j++) {
      const changenumber = await Accounts.findOneAndUpdate(
        { altnum: j },
        { number: j - 1 },
        {
          new: true
        }
      );
    }
    for (j = i; j < accounts.length; j++) {
      const changealtnum = await Accounts.findOneAndUpdate(
        { number: j },
        { altnum: j },
        {
          new: true
        }
      );
    }
    const newAccounts = await Accounts.find();

    return res.status(200).json({
      accounts: newAccounts
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.edit = async (req, res) => {
  try {
    const account = await Accounts.findOne({ _id: req.params.id });
    if (!account)
      return res.status(400).json({
        message: "Accounts doesn't exist."
      });

    return res.status(200).json({
      account: account
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {

  try {

    let {
      id, account_name, primary_contact_firstname, primary_contact_lastname, primary_contact_mobile, 
      primary_contact_email, address_line1, address_line2, city, state, postcode, country, company_eamil, status
    } = req.body;

    const before = await Accounts.findOne({ _id: id });
    const updateData = await Accounts.findOneAndUpdate(
      { _id: id },
      {
        account_name, primary_contact_firstname, primary_contact_lastname, primary_contact_mobile, 
        primary_contact_email, address_line1, address_line2, city, state, postcode, country, company_eamil, status
      },
      {
        new: true
      }
    ).exec();
    return res.status(200).json({
      success: true,
      message: "successfully updated!"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};