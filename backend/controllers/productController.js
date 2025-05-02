const Product = require("../models/Product");
const EventsHasProducts = require("../models/EventsHasProducts");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
const { ObjectId } = require('mongodb');
const multer = require('multer');
const upload = multer({ dest: './uploads/images/' });

// Controller for getting all products
const getProducts = async (req, res) => {
  try {
    const userId = req.user.id;
    const products = await Product.find();
    console.log(products);
    res.status(200).json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to load products" });
  }
};

const getSellerProducts = async (req, res) => {
  try {
    const userId = req.user.id;
    const products = await Product.find({ user_id: userId });
    console.log(products);
    res.status(200).json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to load products" });
  }
};

// Controller for deleting a product
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const hasDependencies = await EventsHasProducts.findOne({ product_id: id });
    
    if (hasDependencies) {
      return res.status(400).json({ message: "Cannot delete product. It is referenced in events." });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const oldImagePath = deletedProduct.image_path;
    if (oldImagePath) {
      fs.unlink(`.`+oldImagePath, (err) => {
        if (err) {
          console.error("Error deleting old image:", err);
        } else {
          console.log("Old image deleted successfully");
        }
      });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete product" });
  }
};

// Controller for creating a new product
const createProduct = async (req, res) => {
  const { name, qty, price } = req.body;
  const user_id = req.user.id;
  const image_path = req.file ? "/uploads/images/"+req.file.filename : null;

  try {
    const newProduct = new Product({ name, image_path, qty, price, user_id });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: "Failed to create product" });
  }
};

// Controller for updating a product
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const userId = req.user.id;

  console.log('Request Body:', req.body);
  console.log('Uploaded File:', req.file);

  try {
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updateData = {
      $set: {
        name: updates.name,
        qty: updates.qty,
        price: updates.price,
        user_id: userId ? new ObjectId(userId) : existingProduct.user_id
      }
    };

    if (req.file) {
      const oldImagePath = existingProduct.image_path;
      fs.unlink(`.`+oldImagePath, (err) => {
        if (err) {
          console.error("Error deleting old image:", err);
        } else {
          console.log("Old image deleted successfully");
        }
      });

      updateData.$set.image_path = "/uploads/images/" + req.file.filename;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update product" });
  }
};



const searchProducts = async (req, res) => {
  try {
    const query = req.params.query || "";

    const searchCriteria = {
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { qty: { $regex: query, $options: 'i' } },
        { price: { $regex: query, $options: 'i' } } 
      ]
    };

    const products = query ? await Product.find(searchCriteria) : await Product.find();

    console.log(products);
    res.status(200).json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to load products" });
  }
};

const searchSellerProducts = async (req, res) => {
  try {
    const userId = req.user.id;
    var query = req.params.query || "";

    if(query === "1"){
      query = false;
    }

    const searchCriteria = {
      user_id: userId,
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { qty: { $regex: query, $options: 'i' } },
        { price: { $regex: query, $options: 'i' } } 
      ]
    };

    const products = query ? await Product.find(searchCriteria) : await Product.find({ user_id: userId });

    console.log(products);
    res.status(200).json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to load products" });
  }
};


module.exports = {
  getProducts,
  getSellerProducts,
  deleteProduct,
  createProduct,
  updateProduct,
  searchProducts,
  searchSellerProducts  
};
