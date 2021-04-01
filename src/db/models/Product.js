const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const ProductSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, "Product Name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product Description is required"],
      trim: true,
    },
    unitPrice: {
      type: Number,
      required: [true, "Unit Price is required"],
    },
    categoryID: {
      type: Number,
      required: [true, "Category ID is required"],
    },
    rate: {
      type: Number,
      required: [true, "Rate is required"],
    },
    stock: {
      type: Number,
      required: [true, "Stock is required"],
    },
    warranty: {
      type: Number,
      required: [true, "Warranty is required"],
    },
  },
  { versionKey: false }
);


const Product = mongoose.model("Product", ProductSchema);
module.exports = { Product };
