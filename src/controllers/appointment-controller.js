//importing validation functions
const { parseDate, isValidAppointmentTime } = require("../utils/validation");
//importing the Appointment, Client, Car models
const Appointment = require("../models/Appointment");
const Car = require("../models/Car");
const Client = require("../models/Client");

const createAppointment = async (req, res) => {
  const { clientId, licensePlate, contactMethod, action, preferredDate } =
    req.body;

  try {
    //validate contact method
    const validContactMethods = ["email", "phone", "in-person"];
    if (!validContactMethods.includes(contactMethod)) {
      return res.status(400).json({
        message:
          "Invalid contact method. Choose between 'email', 'phone', or 'in-person'.",
      });
    }
    //parse and validate appointment date
    const appointmentDate = parseDate(preferredDate);
    if (!isValidAppointmentTime(appointmentDate)) {
      return res.status(400).json({
        message:
          "Preferred date must be within the working hours (08:00 - 17:00) and in 30-minute intervals.",
      });
    }

    const client = await Client.findById(clientId).populate("cars");
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    //find the car by license plate
    const car = await Car.findOne({ licensePlate });
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    //check if the car belongs to the client
    const carBelongsToClient = client.cars.some(
      (clientCar) => clientCar._id.toString() === car._id.toString()
    );

    if (!carBelongsToClient) {
      return res
        .status(403)
        .json({ message: "This car does not belong to the client" });
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

    res.status(201).json({
      message: "Appointment created successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating appointment",
      error: error.message,
    });
  }
};

const updateAppointment = async (req, res) => {
  console.log(req.params);
  const { id } = req.params;
  const { receptionIssues, carRepairs, repairDuration } = req.body;

  try {
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
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
    if (repairDuration) {
      if (repairDuration % 10 !== 0) {
        return res
          .status(400)
          .json({ message: "Duration must be a multiple of 10 minutes" });
      }
      appointment.repairDuration = repairDuration;
    }

    await appointment.save();
    res.status(200).json({
      message: "Appointment updated successfully with reparations details",
      appointment,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating appointment", error: error.message });
  }
};

const getAppointmentById = async (req, res) => {
  const { id } = req.params;
  try {
    const appointment = await Appointment.findById(id).populate("clientId");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    return res.status(200).json(appointment);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error retrieving appointment", error: error.message });
  }
};

//get all appointments from the database
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching appointments", error: error.message });
  }
};

module.exports = {
  createAppointment,
  updateAppointment,
  getAppointmentById,
  getAllAppointments,
};
