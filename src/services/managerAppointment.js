const { parseDate, isValidAppointmentTime } = require("../utils/validation");
const Client = require("../models/Client");
const Car = require("../models/Car");
const Appointment = require("../models/Appointment");

const createAppointment = async ({
  clientId,
  licensePlate,
  contactMethod,
  action,
  preferredDate,
}) => {
  //validate contact method
  const validContactMethods = ["email", "phone", "in-person"];
  if (!validContactMethods.includes(contactMethod)) {
    throw new Error(
      "Invalid contact method. Choose between 'email', 'phone', or 'in-person'."
    );
  }
  //parse and validate appointment date
  const appointmentDate = parseDate(preferredDate);
  if (!isValidAppointmentTime(appointmentDate)) {
    throw new Error(
      "Preferred date must be within the working hours (08:00 - 17:00) and in 30 minute intervals."
    );
  }

  const client = await Client.findById(clientId).populate("cars");
  if (!client) {
    throw new Error("Client not found");
  }

  //find the car by license plate
  const car = await Car.findOne({ licensePlate });
  if (!car) {
    throw new Error("Car not found");
  }

  //check if the car belongs to the client
  const carBelongsToClient = client.cars.some(
    (clientCar) => clientCar._id.toString() === car._id.toString()
  );
  if (!carBelongsToClient) {
    throw new Error("This car does not belong to the client");
  }

  const appointment = new Appointment({
    clientId,
    carId: car._id,
    licensePlate,
    contactMethod,
    action,
    preferredDate: appointmentDate,
  });

  await appointment.save();
  return appointment;
};

const updateAppointmentDetails = async (id, updates) => {
  const { receptionIssues, carRepairs, repairDuration } = updates;

  const appointment = await Appointment.findById(id);
  if (!appointment) {
    throw new Error("Appointment not found");
  }

  //update reception issues if provided
  if (receptionIssues) {
    appointment.receptionIssues = receptionIssues;
  }
  //update car repairs if provided
  if (carRepairs) {
    appointment.carRepairs = carRepairs;
  }

  //validate and update repair duration
  if (repairDuration !== undefined) {
    if (repairDuration % 10 !== 0) {
      const err = new Error("Duration must be a multiple of 10 minutes");
      err.statusCode = 400;
      throw err;
    }
    appointment.repairDuration = repairDuration;
  }

  await appointment.save();
  return appointment;
};

module.exports = {
  createAppointment,
  updateAppointmentDetails,
};
