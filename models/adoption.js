const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adoptionSchema = new Schema(
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
    birthDate: {
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

const Adoption = mongoose.model("Adoption", adoptionSchema);
module.exports = Adoption;
