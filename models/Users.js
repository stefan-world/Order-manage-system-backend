const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const bcrypt = require("bcryptjs");

const usersSchema = new Schema({
  number:{type:Number},
  altnum:{type:Number},
  username: { type: String, required: true },
  avatar: {
    type: String,
    default:process.env.BASEURL + process.env.PORT + '/uploads/user_avatar/default.png'
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default:'user'
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'active',
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

// generating a hash
usersSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(), null);
};

// checking if password is valid
usersSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("Users", usersSchema);
