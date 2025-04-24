const {
  validateChassisNumber,
  validatePhoneNumbers,
} = require("../utils/validation");
const Client = require("../models/Client");
const Car = require("../models/Car");

const addClientWithCars = async ({
  firstName,
  lastName,
  phoneNumber,
  email,
  cars,
}) => {
  //validate the phone number format
  const phoneValidation = validatePhoneNumbers(phoneNumber);
  if (!phoneValidation.isValid) {
    const error = new Error(phoneValidation.message);
    error.statusCode = 400;
    throw error;
  }

  //validate the chassis number format for each car
  for (let car of cars) {
    if (!validateChassisNumber(car.chassisNumber)) {
      const error = new Error("Chassis number must respect the format");
      error.statusCode = 400;
      throw error;
    }
  }

  //function that checks if client already exists
  const existingClient = await Client.findOne({ email });
  if (existingClient) {
    const error = new Error("This client already exists");
    error.statusCode = 400;
    throw error;
  }

  //create and save cars in database
  const carDocs = await Promise.all(
    cars.map(async (car) => {
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
    })
  );

  //create and save new clients in database
  const newClient = new Client({
    firstName,
    lastName,
    phoneNumber,
    email,
    cars: carDocs,
  });

  await newClient.save();

  return newClient;
};

const updateClientDetails = async (
  id,
  { firstName, lastName, phoneNumber, email }
) => {
  // validate phone number
  const phoneValidation = validatePhoneNumbers(phoneNumber);
  if (!phoneValidation.isValid) {
    const error = new Error(phoneValidation.message);
    error.statusCode = 400;
    throw error;
  }

  // find and update client details
  const updatedClient = await Client.findByIdAndUpdate(
    id,
    { firstName, lastName, phoneNumber, email },
    { new: true }
  );

  if (!updatedClient) {
    const error = new Error("Client not found");
    error.statusCode = 404;
    throw error;
  }

  return updatedClient;
};

//adds new cars to an existing client
const addCarsToClientById = async (clientId, cars) => {
  if (!cars || !Array.isArray(cars) || cars.length === 0) {
    const error = new Error("Please provide at least one car");
    error.statusCode = 400;
    throw error;
  }

  for (let car of cars) {
    if (!validateChassisNumber(car.chassisNumber)) {
      const error = new Error(`Invalid chassis number: ${car.chassisNumber}`);
      error.statusCode = 400;
      throw error;
    }
  }

  const client = await Client.findById(clientId);
  if (!client) {
    const error = new Error("Client not found");
    error.statusCode = 404;
    throw error;
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

  return client;
};

//logic for activates or deactivates a client account
const updateClientStatusById = async (clientId, isActive) => {
  const client = await Client.findById(clientId);
  if (!client) {
    const error = new Error("Client not found");
    error.statusCode = 404;
    throw error;
  }
  //update active status
  client.isActive = isActive;
  await client.save();

  return client;
};

module.exports = {
  addClientWithCars,
  updateClientDetails,
  addCarsToClientById,
  updateClientStatusById,
};
