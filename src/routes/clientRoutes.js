const express = require("express");
const router = express.Router();
const clientController = require("../controllers/client-controller");

router.post("/add-client", clientController.addClient);
router.put("/update-client/:id", clientController.updateClient);
router.post("/add-cars-to-client/:id", clientController.addCarsToClient);
router.put("/is-active/:id", clientController.disableClientStatus);
router.get("/client-by-id/:id", clientController.getClientById);
router.get("/clients", clientController.getAllClients);

module.exports = router;
