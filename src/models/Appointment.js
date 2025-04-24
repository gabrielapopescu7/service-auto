const mongoose = require("mongoose");
const { Schema } = mongoose;

const appointmentSchema = new Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  carId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  licensePlate: {
    type: String,
    required: true,
  },
  contactMethod: {
    type: String,
    enum: ["email", "phone", "in-person"],
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  preferredDate: {
    type: Date,
  },
  receptionIssues: {
    type: String,
    required: false,
  },
  carRepairs: {
    type: String,
    required: false,
  },
  repairDuration: {
    type: Number, 
    required: false,
  },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
