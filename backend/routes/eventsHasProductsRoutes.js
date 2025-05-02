const express = require("express");
const { authenticationUtil } = require("../utils");
const {
  getEventProducts,
  getSellerEventProducts,
  createEventProduct,
  deleteEventProduct,
  updateEventProduct,
  searchEventProducts,
} = require("../controllers/eventsHasProductsController");

const eventProductRoutes = express.Router();

// Routes for CRUD operations on EventHasProducts
eventProductRoutes.get("/getEventProducts/:eventId", getEventProducts);
eventProductRoutes.get("/getSellerEventProducts", authenticationUtil, getSellerEventProducts);
eventProductRoutes.post("/createEventProduct", authenticationUtil, createEventProduct);
eventProductRoutes.delete("/deleteEventProduct/:id", authenticationUtil, deleteEventProduct);
eventProductRoutes.put("/updateEventProduct/:id/:status", updateEventProduct);
eventProductRoutes.get("/searchEventProducts/:query", authenticationUtil, searchEventProducts);

module.exports = eventProductRoutes;
