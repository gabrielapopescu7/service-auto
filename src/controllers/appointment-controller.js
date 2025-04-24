//importing the Appointment model
const Appointment = require("../models/Appointment");
const appointmentsManager = require("../manager/appointmentManager");
const createAppointment = async (req, res) => {
  try {
    //used appointmentsManager to create a new appointment using the data from the request body
    const appointment = await appointmentsManager.createAppointment(req.body);
    res.status(201).json({
      message: "Appointment created successfully",
      appointment,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const updateAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    //used appointmentsManager to update an appointment
    const updated = await appointmentsManager.updateAppointmentDetails(
      id,
      req.body
    );
    res.status(200).json({
      message: "Appointment updated successfully with reparations details",
      appointment: updated,
    });
  } catch (error) {
    const status = error.statusCode || 500;
    res.status(status).json({
      message: error.message || "Error updating appointment",
    });
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
