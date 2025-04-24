const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointment-controller");

router.post("/appointment", appointmentController.createAppointment);
router.put("/update-appointment/:id", appointmentController.updateAppointment);
router.get("/appointment-by-id/:id", appointmentController.getAppointmentById);
router.get("/appointments", appointmentController.getAllAppointments);

module.exports = router;
