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
  } catch (error) {
    const validationErr = getErrors(error);
    console.log(validationErr);
    return res
      .status(401)
      .send({ status: false, type: "VALIDATION", error: validationErr });
  }

  res.send({ status: true });
});

// UPDATE product. Takes request body
productRouter.post("/api/update/product", async (req, res) => {
  const {
    _id,
    productName,
    description,
    unitPrice,
    categoryID,
    stock,
    warranty,
    rate,
  } = req.body;

  if (
    !validateReqBody(
      _id,
      productName,
      description,
      unitPrice,
      categoryID,
      stock,
      warranty,
      rate
    )
  ) {
    return res
      .status(401)
      .send({ status: false, type: "INVALID", error: "invalid request body" });
  }
  try {
    const newProduct = new Product({
      _id,
      productName,
      description,
      unitPrice,
      categoryID,
      stock,
      warranty,
      rate,
    });
    const product = await Product.findByIdAndUpdate(_id, { $set: newProduct });
    if (!product) {
      return res.status(404).send({ status: false, _id });
    }
    return res.status(201).send({ status: true, product });
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

module.exports = { productRouter };