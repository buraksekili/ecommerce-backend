const express = require("express");
const { Product } = require("../db/models/Product");
const { validateReqBody, getErrors } = require("../helpers");

const productRouter = express.Router();

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

module.exports = { productRouter };
