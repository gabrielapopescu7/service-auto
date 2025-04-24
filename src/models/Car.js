const mongoose = require("mongoose");
const { Schema } = mongoose;

const carSchema = new Schema(
  {
    licensePlate: {
      type: String,
      required: true,
      unique: true,
    },
    chassisNumber: {
      type: String,
      required: true,
      unique: true,
    },
    brand: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    engineType: {
      type: String,
      enum: ["diesel", "petrol", "hybrid", "electric"],
      required: true,
    },
    engineCapacity: {
      type: Number,
      required: true,
    },
    horsepower: {
      type: Number,
      required: true,
    },
    powerKW: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Car", carSchema);
