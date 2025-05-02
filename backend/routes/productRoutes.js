const express = require("express");
const { authenticationUtil } = require("../utils");
const {
  getProducts,
  getSellerProducts,
  deleteProduct,
  createProduct,
  updateProduct,
  searchProducts,
  searchSellerProducts,
} = require("../controllers/productController");
const multer = require("multer");
const path = require("path");
const fs = require('fs');

const productRouter = express.Router();

const uploadDir = './uploads/images';

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const upload = multer({ storage: storage });

// Routes for CRUD operations on products
productRouter.get("/sellerItems", authenticationUtil, getSellerProducts);
productRouter.get("/items", authenticationUtil, getProducts);
productRouter.post("/createItem", authenticationUtil, upload.single('image'), createProduct);
productRouter.delete("/deleteItem/:id", authenticationUtil, deleteProduct);
productRouter.put("/updateItem/:id", authenticationUtil, upload.single('image'), updateProduct);
productRouter.get("/sellerSearch/:query", authenticationUtil, searchSellerProducts);
productRouter.get("/search/:query", searchProducts);

module.exports = productRouter;
