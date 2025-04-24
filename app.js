const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");

const clientRoutes = require("./src/routes/clientRoutes");
const appointmentRoutes = require("./src/routes/appointmentRoutes");

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
const connectDB = require("./src/config/db");
connectDB();

app.use("/api", clientRoutes);
app.use("/api", appointmentRoutes);

module.exports = app;
