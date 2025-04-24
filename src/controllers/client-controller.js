//importing the Client and Car models
const Client = require("../models/Client");
const Car = require("../models/Car");
//importing validation functions
const {
  validatePhoneNumbers,
  validateChassisNumber,
} = require("../utils/validation");

//handles the process of adding a new client and associating their cars
const addClient = async (req, res) => {
  const { firstName, lastName, phoneNumber, email, cars } = req.body;

  //validate the phone number format
  const phoneValidation = validatePhoneNumbers(phoneNumber);
  if (!phoneValidation.isValid) {
    return res.status(400).json({ message: phoneValidation.message });
  }

  //validate the chassis number format for each car
  for (let car of cars) {
    if (!validateChassisNumber(car.chassisNumber)) {
      return res
        .status(400)
        .json({ message: "Chassis number must respect the format" });
    }
  }

  try {
    const existingClient = await Client.findOne({ email });
    //check if a client with the same email already exists
    if (existingClient) {
      return res.status(400).json({ message: "This client already exists" });
    }
    //create and save car informations
    const carPromises = cars.map(async (car) => {
      const newCar = new Car({
        licensePlate: car.licensePlate,
        chassisNumber: car.chassisNumber,
        brand: car.brand,
        model: car.model,
        year: car.year,
        engineType: car.engineType,
        engineCapacity: car.engineCapacity,
        horsepower: car.horsepower,
        powerKW: car.powerKW || Math.round(car.horsepower * 0.7355),
      });
      await newCar.save();
      return newCar;
    });

    const carsDetails = await Promise.all(carPromises);
    //create and save a new car
    const newClient = new Client({
      firstName,
      lastName,
      phoneNumber,
      email,
      cars: carsDetails,
    });

    await newClient.save();
    res.status(201).json({ message: "Client was successfully created" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error at creating client", error: error.message });
  }
};

//updates an existing client's informations
const updateClient = async (req, res) => {
  const { id } = req.params;

  const { firstName, lastName, phoneNumber, email } = req.body;

  //validate the phone number format
  const phoneValidation = validatePhoneNumbers(phoneNumber);
  if (!phoneValidation.isValid) {
    return res.status(400).json({ message: phoneValidation.message });
  }

  try {
    //find and update the client by ID
    const updatedClient = await Client.findByIdAndUpdate(
      id,
      { firstName, lastName, phoneNumber, email },
      { new: true }
    );

    if (!updatedClient) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(200).json({
      message: "Client updated successfully",
      client: updatedClient,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating client",
      error: error.message,
    });
  }
};

//adds new cars to an existing client
const addCarsToClient = async (req, res) => {
  const { id } = req.params;
  const { cars } = req.body;

  if (!cars || !Array.isArray(cars) || cars.length === 0) {
    return res.status(400).json({ message: "Please provide at least one car" });
  }

  for (let car of cars) {
    if (!validateChassisNumber(car.chassisNumber)) {
      return res
        .status(400)
        .json({ message: `Invalid chassis number: ${car.chassisNumber}` });
    }
  }

  try {
    const client = await Client.findById(id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    const carPromises = cars.map(async (car) => {
      const newCar = new Car({
        licensePlate: car.licensePlate,
        chassisNumber: car.chassisNumber,
        brand: car.brand,
        model: car.model,
        year: car.year,
        engineType: car.engineType,
        engineCapacity: car.engineCapacity,
        horsepower: car.horsepower,
        powerKW: car.powerKW || Math.round(car.horsepower * 0.7355),
      });
      await newCar.save();
      return newCar;
    });

    const newCars = await Promise.all(carPromises);

    client.cars.push(...newCars);
    await client.save();

    res.status(200).json({
      message: "Successfully added cars to client",
      client,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding cars to client",
      error: error.message,
    });
  }
};

//logic for activates or deactivates a client account
const disableClientStatus = async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;

  try {
    const client = await Client.findById(id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    //update active status
    client.isActive = isActive;
    await client.save();

    res.status(200).json({
      message: `Client ${
        client.isActive ? "activated" : "deactivated"
      } successfully`,
      client,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating client status",
      error: error.message,
    });
  }
};

const getClientById = async (req, res) => {
  const { id } = req.params;

  try {
    const client = await Client.findById(id).populate("cars");

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    return res.status(200).json(client);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error retrieving client", error: error.message });
  }
};

//fetches all clients and their associated cars
const getAllClients = async (req, res) => {
  try {
    //search client and populate car references
    const clients = await Client.find().populate("cars");
    res.status(200).json(clients);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching clients", error: error.message });
  }
};

module.exports = {
  addClient,
  updateClient,
  addCarsToClient,
  disableClientStatus,
  getClientById,
  getAllClients,
};
