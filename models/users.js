const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: false,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      required: false,
    },
    petName: {
      type: String,
      required: false,
    },
    petType: {
      type: String,
      required: false,
    },
    petAge: {
      type: Number,
      required: false,
      min: 0,
    },
    cart: {
      type: [Object],
    },
  },
  { timestamps: true, versionKey: false }
);

const Users = mongoose.model("Users", userSchema);
module.exports = Users;
