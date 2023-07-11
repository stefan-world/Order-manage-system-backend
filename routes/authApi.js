const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");
const Users = mongoose.model("Users");

const { catchErrors } = require("../handlers/errorHandlers");
const {
  isValidToken,
  login,
  register
} = require("../controllers/authController");

const admin = {
  avatar: process.env.BASEURL + process.env.PORT + '/uploads/admin/admin.png',
  number: 1,
  altnum: 1,
  email: 'admin@demo.com',
  username: 'Raju Vama',
  password: 'admin',
  role: 'admin',
  phone: '+1234567890',
  address: 'Australia',
  status: 'active',
  account_id: 'general_user'
};

////////////////////////////   initialing first by admin ///////////
const init = async (initialAdmin) => {

  let { email, avatar, password, username, role, address, phone, number, altnum, status, account_id } = initialAdmin;

  const existingAdmin = await Users.findOne({ role: role });
  if (existingAdmin)
    return;
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);

  const newAdmin = new Users({
    number,
    altnum,
    email,
    avatar,
    password: passwordHash,
    username,
    role,
    address,
    phone,
    status,
    account_id
  });

  const savedAdmin = await newAdmin.save();
  return;
};

init(admin);

router.route("/login").post(catchErrors(login));
router.route("/me").get(catchErrors(isValidToken));
router.route("/signup").post(catchErrors(register));

module.exports = router;
