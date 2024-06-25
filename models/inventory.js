const mongoose = require("mongoose");
const multer = require("multer");
const Schema = mongoose.Schema;

const inventorySchema = new Schema(
  {
    productName: {
      type: String,
      required: true,
      unique: true,
    },
    productPrice: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    petType: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true, versionKey: false }
);

const Inventory = mongoose.model("Inventory", inventorySchema);
module.exports = Inventory;
