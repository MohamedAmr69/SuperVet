const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionsSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    productId: {
      type: [String],
      required: true,
    },
    productName: {
      type: [String],
      required: true
    },
    productPrice: {
      type: [Number],
      required: true,
    },
    category: {
      type: [String],
      required: true,
    },
    quantity: {
      type: [Number],
      required: true,
    },
    petType: {
      type: [String],
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const Transaction = mongoose.model("Transaction", transactionsSchema);
module.exports = Transaction;
