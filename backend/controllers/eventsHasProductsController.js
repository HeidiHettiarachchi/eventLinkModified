const EventsHasProducts = require("../models/EventsHasProducts");
const Products = require("../models/Product");
const { ObjectId } = require('mongodb');

// Controller for getting all products associated with a specific event
const getEventProducts = async (req, res) => {
  const { eventId } = req.params;

  if (!eventId) {
    return res.status(400).json({ message: "Invalid request data" });
  }

  try {
    const eventProducts = await EventsHasProducts.find({ event_id: eventId });

    if (eventProducts.length === 0) {
      return res.status(404).json({ message: "No products found for this event" });
    }

    res.status(200).json(eventProducts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to retrieve event products" });
  }
};


// Controller for getting all products associated with a specific seller
const getSellerEventProducts = async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    return res.status(400).json({ message: "Invalid request data" });
  }

  console.log(userId);

  try {
    const eventProducts = await EventsHasProducts.find()
    .populate({
      path: 'event_id',
      match: { eventStatus: "Approved" },
    })
    .populate({
      path: 'product_id',
      match: { user_id: userId },
    });
    
    const filteredEventProducts = eventProducts.filter(eventProduct => 
      eventProduct.event_id !== null && eventProduct.product_id !== null
    );

    if (filteredEventProducts.length === 0) {
      return res.status(404).json({ message: "No products found for this event" });
    }

    res.status(200).json(filteredEventProducts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to retrieve event products" });
  }
};


// Controller for creating a new association between an event and a product
const createEventProduct = async (req, res) => {
  const { eventId, resources } = req.body;

  if (!eventId || !resources) {
    return res.status(400).json({ message: "Invalid request data" });
  }

  try {
    const parsedResources = JSON.parse(resources);

    if (!Array.isArray(parsedResources)) {
      return res.status(400).json({ message: "Resources must be an array" });
    }

    await EventsHasProducts.deleteMany({ event_id: new ObjectId(eventId) });

    const eventProducts = await Promise.all(parsedResources.map(async (resource) => {
      const newEventProduct = new EventsHasProducts({
        event_id: eventId,
        product_id: resource.itemId,
        qty: resource.qty
      });

      await newEventProduct.save();

      const product = await Products.findById(resource.itemId);
      const currentQty = parseFloat(product.qty);

      if (currentQty >= resource.qty) {
        await Products.updateOne(
          { _id: new ObjectId(resource.itemId) },
          { $set: { qty: (currentQty - resource.qty).toString() } }
        );
      } else {
        throw new Error("Insufficient quantity available");
      }

      return newEventProduct;
    }));

    res.status(201).json(eventProducts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create event product associations" });
  }
};



// Controller for deleting an association between an event and a product
const deleteEventProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEventProduct = await EventHasProducts.findByIdAndDelete(id);

    if (!deletedEventProduct) {
      return res.status(404).json({ message: "Event product association not found" });
    }

    res.status(200).json({ message: "Event product association deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete event product association" });
  }
};

// Controller for updating an association between an event and a product
const updateEventProduct = async (req, res) => {
  const { id, status } = req.params;

  try {
    const updatedEventProduct = await EventsHasProducts.findByIdAndUpdate(
      id,
      { accepted: status },
      { new: true }
  );

    if (!updatedEventProduct) {
      // return res.status(404).json({ message: "Event product association not found" });
    }

    res.status(200).json(updatedEventProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update event product association" });
  }
};

// Controller for searching event products
const searchEventProducts = async (req, res) => {
  try {
    const query = req.params.query || "";
    const searchCriteria = {
      $or: [
        { event_id: { $regex: query, $options: 'i' } },
        { product_id: { $regex: query, $options: 'i' } },
        { accepted: { $regex: query, $options: 'i' } }
      ]
    };

    const eventProducts = query ? await EventHasProducts.find(searchCriteria).populate('product_id') : await EventHasProducts.find().populate('product_id');

    res.status(200).json(eventProducts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load event products" });
  }
};

module.exports = {
  getEventProducts,
  getSellerEventProducts,
  createEventProduct,
  deleteEventProduct,
  updateEventProduct,
  searchEventProducts,
};
