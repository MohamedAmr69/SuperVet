const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const missingSchema = new Schema(
  {
    petName: {
      type: String,
      required: true,
    },
    postOwner: {
      type: String,
      required: true,
    },
    petType: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    status: { type: String, required: true },
    date: {
      type: Date,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
    },
    contactEmail: { type: String },
    image: {
      type: String,
    },
  },
  { timestamps: true, versionKey: false }
);

const Missing = mongoose.model("Missing", missingSchema);
module.exports = Missing;
