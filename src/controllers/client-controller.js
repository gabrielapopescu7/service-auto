//imported Client model
const Client = require("../models/Client");
const managerClients = require("../services/managerClients");

//handles the process of adding a new client and associating their cars
const addClient = async (req, res) => {
  try {
    //used managerClients to add cars to client
    await managerClients.addClientWithCars(req.body);
    res.status(201).json({ message: "Client was successfully created" });
  } catch (error) {
    const status = error.statusCode || 500;
    res.status(status).json({
      message: error.message || "Error at creating client",
    });
  }
};

//updates an existing client's informations
const updateClient = async (req, res) => {
  const { id } = req.params;

  try {
    //used managerClients to update clients details
    const updatedClient = await managerClients.updateClientDetails(
      id,
      req.body
    );

    res.status(200).json({
      message: "Client updated successfully",
      client: updatedClient,
    });
  } catch (error) {
    const status = error.statusCode || 500;
    res.status(status).json({
      message: error.message || "Error updating client",
    });
  }
};

//adds new cars to an existing client
const addCarsToClient = async (req, res) => {
  const { id } = req.params;
  const { cars } = req.body;

  try {
    //used managerClients to add cars to an existing client based on their id
    const client = await managerClients.addCarsToClientById(id, cars);
    res.status(200).json({
      message: "Successfully added cars to client",
      client,
    });
  } catch (error) {
    const status = error.statusCode || 500;
    res.status(status).json({
      message: error.message || "Error adding cars to client",
    });
  }
};

//logic for activates or deactivates a client account
const disableClientStatus = async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;

  try {
    //used managerClients to update client status
    const client = await managerClients.updateClientStatusById(id, isActive);
    res.status(200).json({
      message: `Client ${
        client.isActive ? "activated" : "deactivated"
      } successfully`,
      client,
    });
  } catch (error) {
    const status = error.statusCode || 500;
    res.status(status).json({
      message: error.message || "Error updating client status",
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
