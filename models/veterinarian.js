const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const veterinarianSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
      unique: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const Veterinarian = mongoose.model("Veterinarian", veterinarianSchema);
module.exports = Veterinarian;
