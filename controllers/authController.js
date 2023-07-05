const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");
const Users = mongoose.model("Users");

require("dotenv").config({ path: ".variables.env" });

exports.register = async (req, res) => {

  try {
    let { username, email, password, phone, address, role } = req.body;
    if (!email || !password || !username || !phone || !address)
      return res.status(400).json({ message: "Not all fields have been entered." });
    if (password.length < 5)
      return res
        .status(400)
        .json({ success: false, message: "The password needs to be at least 5 characters long." });

    const existingUser = await Users.findOne({ email: email });

    if (existingUser)
      return res
        .status(200)
        .json({ success: false, message: "An user with this email already exists." });

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const allUser = await Users.find();
    const number = allUser.length + 1;
    const altnum = number;

    const newUser = new Users({
      username,
      number,
      altnum,
      email,
      password: passwordHash,
      phone,
      address,
      role
    });

    const savedUser = await newUser.save();
    const users = await Users.find();

    return res.status(200).json({
      success: true,
      message: "Registered successfully! Please check your accounts list!"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.login = async (req, res) => {

  try {
    const { email, password } = req.body;

    // validate
    if (!email || !password)
      return res.status(400).json({ message: "Please check your email and password." });

    const users = await Users.findOne({ email: email });
    if (!users)
      return res.status(400).json({
        message: "No account with this email has been registered.",
      });

    const isMatch = await bcrypt.compare(password, users.password);
    if (!isMatch)
      return res.status(400).json({
        message: "Invalid password.",
      });

    const accessToken = jwt.sign(
      { id: users._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_TOKEN_EXPIRATION }
    );

    return res.status(200).json({
      accessToken: accessToken,
      user: users
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.isValidToken = async (req, res) => {
  try {

    const token = req.headers.authorization;

    if (!token)
      return res.status(401).json({
        message: 'Authorization token missing',
      });

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified)
      return res.status(401).json({
        message: "Token verification failed, authorization denied.",
      });

    const user = await Users.findOne({ _id: verified.id });
    if (!user)
      return res.status(401).json({
        message: "User doens't Exist, authorization denied.",
      });

    return res.status(200).json({ user: user });


  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};


exports.list = async (req, res) => {
  try {
    const users = await Users.find();

    if (!users)
      return res.status(400).json({
        message: "No users has been registered."
      });

    return res.status(200).json({
      accounts: users,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    const number = await Users.findOne({ _id: id }).exec();
    const users = await Users.find().exec();

    const i = number.number;

    const result = await Users.findOneAndDelete({ _id: id }).exec();

    for (j = i + 1; j <= users.length; j++) {
      const changenumber = await Users.findOneAndUpdate(
        { altnum: j },
        { number: j - 1 },
        {
          new: true
        }
      ).exec();
    }
    for (j = i; j < users.length; j++) {
      const changealtnum = await Users.findOneAndUpdate(
        { number: j },
        { altnum: j },
        {
          new: true
        }
      ).exec();
    }

    if (!result)
      return res.status(400).json({
        message: "It doesn't exist."
      });

    const newusers = await Users.find().exec();

    return res.status(200).json({
      accounts: newusers
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.edit = async (req, res) => {
  try {
    const user = await Users.findOne({ _id: req.params.id });
    if (!user)
      return res.status(400).json({
        message: "No partner has been registered."
      });
    return res.status(200).json({
      account: user
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {

  try {
    let { id, username, email, password, phone, role, address } = req.body;
    if (!id || !email || !username || !address)
      return res.status(400).json({ message: "Not all fields have been entered." });
    if (password!="")
      if (password.length < 5)
        return res
          .status(400)
          .json({ success: false, message: "The password needs to be at least 5 characters long." });

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    if (password != "") {
      const updateData = await Users.findOneAndUpdate(
        { _id: id },
        {
          username,
          address,
          email,
          password: passwordHash,
          role,
          phone,
        },
        {
          new: true
        }
      ).exec();
    }
    else {
      const user = await Users.findOne({ _id: id });

      const updateData = await Users.findOneAndUpdate(
        { _id: id },
        {
          username,
          address,
          email,
          password: user.password,
          phone,
          role
        },
        {
          new: true
        }
      ).exec();
    }

    return res.status(200).json({
      success: true,
      message: "Updated successfully! Please check your accounts list!"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};