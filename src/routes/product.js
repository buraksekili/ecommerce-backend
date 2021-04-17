const express = require("express");
const { Product } = require("../db/models/Product");
const { validateReqBody, getErrors } = require("../helpers");

const productRouter = express.Router();

// Create Product
productRouter.post("/api/product", async (req, res) => {
  const {
    productName,
    description,
    unitPrice,
    categoryID,
    stock,
    warranty,
    userType,
  } = req.body;

  if (
    !validateReqBody(
      productName,
      description,
      unitPrice,
      categoryID,
      stock,
      warranty
    )
  ) {
    return res
      .status(401)
      .send({ status: false, type: "INVALID", error: "invalid request body" });
  }
  try {
    if (userType != 2) {
      throw new Error("invalid user type");
    }

    const newProduct = new Product({
      productName,
      description,
      unitPrice,
      categoryID,
      stock,
      warranty,
      rate: 0,
    });

    await newProduct.save();
    res.send({ status: true, product: newProduct });
  } catch (error) {
    const validationErr = getErrors(error);
    console.log(validationErr);
    return res
      .status(401)
      .send({ status: false, type: "VALIDATION", error: validationErr });
  }
});

// DELETE products.
productRouter.delete("/api/product/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(401).send({
      status: false,
      type: "INVALID",
      error: "Invalid request parameter, id",
    });
  }
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).send({ status: false, id });
    }
    return res.status(201).send({ status: true, id });
  } catch (error) {
    const validationErr = getErrors(error);
    console.log(validationErr);
    return res
      .status(401)
      .send({ status: false, type: "VALIDATION", error: validationErr });
  }
});

// GET all products
productRouter.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find({});
    return res.send({ status: true, products });
  } catch (error) {
    const validationErr = getErrors(error);
    console.log(validationErr);
    return res
      .status(401)
      .send({ status: false, type: "VALIDATION", error: validationErr });
  }
});

// GET a product
productRouter.get("/api/product/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(401).send({
      status: false,
      type: "INVALID",
      error: "Invalid request parameter, id",
    });
  }

  try {
    const products = await Product.findById(id); //Pass the id of the product that is wanted

    if (!products) {
      throw Error(`no product found ${id}`);
    }
    return res.send({ status: true, products });
  } catch (error) {
    const validationErr = getErrors(error);
    console.log(validationErr);
    return res
      .status(401)
      .send({ status: false, type: "VALIDATION", error: validationErr });
  }
});

productRouter.get("/api/category/product/:category", async (req, res) => {
  const { category } = req.params;

  if (!category) {
    return res.status(401).send({
      status: false,
      type: "INVALID",
      error: "Invalid request parameter, id",
    });
  }

  try {
    // find details of a product
    const products = await Product.find({ categoryID: category }); //Pass the id of the product that is wanted

    if (!products) {
      throw Error(`no product found ${category}`);
    }

    return res.send({ status: true, products });
  } catch (error) {
    const validationErr = getErrors(error);
    console.log(validationErr);
    return res
      .status(401)
      .send({ status: false, type: "VALIDATION", error: validationErr });
  }
});

// productRouter.post("/api/rate/product", async (req, res) => {
//   try {
//     const { id, rate } = req.body;
//     const products = await Product.findById(id); //Passing an empty object retrieve all product objects
//     // products.totalcount += rate
//     // products.rateCount += 1
//     return res.send({ status: true, products });
//   } catch (error) {
//     const validationErr = getErrors(error);
//     console.log(validationErr);
//     return res
//       .status(401)
//       .send({ status: false, type: "VALIDATION", error: validationErr });
//   }
// });

module.exports = { productRouter };
