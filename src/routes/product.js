const express = require("express");
const { Product } = require("../db/models/Product");
const { validateReqBody, getErrors, getCommentsFromID } = require("../helpers");

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
      rateCount: 0,
      rateTotal: 0
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
    let product = await Product.findById(id); //Pass the id of the product that is wanted
    if (!product) {
      throw Error(`no product found ${id}`);
    }
    product = product.toObject();
    const commentIDs = product.comments;
    const comments = await getCommentsFromID(commentIDs);

    product.comments = comments;

    return res.send({ status: true, product });
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

productRouter.post("/api/rate/product", async (req, res) => {
  try {
    const { id, input_rate } = req.body;
    var aproduct = await Product.findById(id); //Passing an empty object retrieve all product objects
    
    var totalCount = aproduct.get("rateCount");
    totalCount += parseInt(input_rate);

    console.log("Total count: ", totalCount);

    var totalRate = aproduct.get("rateTotal");
    totalRate += 1;

    console.log("Total rate: ", totalRate);

    var overallRating = totalCount / totalRate;
    
    //aproduct.update(rateCount = totalCount, rateTotal = totalRate, rate = overallRating);

    //DELETE THE PRODUCT 
    try {
      const product = await Product.findByIdAndDelete(id);
      if (!product) {
        return res.status(404).send({ status: false, id });
      }
    } catch (error) {
      const validationErr = getErrors(error);
      console.log(validationErr);
      return res
        .status(401)
        .send({ status: false, type: "VALIDATION", error: validationErr });
    }
    // ADD THE UPDATED PRODUCT
    try {
      const pname = aproduct.get("productName");
      const descr = aproduct.get("description");
      const price = aproduct.get("unitPrice");
      const cid = aproduct.get("categoryID");
      const stck = aproduct.get("stock");
      const wrrnty = aproduct.get("warranty");

      const newProduct = new Product({
        _id: id,
        productName: pname,
        description: descr,
        unitPrice: price,
        categoryID: cid,
        stock: stck,
        warranty: wrrnty,
        rate: overallRating,
        rateCount: totalCount,
        rateTotal: totalRate
      });
  
      await newProduct.save();
      return res.send({ status: true, newProduct});
    } catch (error) {
      const validationErr = getErrors(error);
      console.log(validationErr);
      return res
        .status(401)
        .send({ status: false, type: "VALIDATION", error: validationErr });
    }

  } catch (error) {
    const validationErr = getErrors(error);
    console.log(validationErr);
    return res
      .status(401)
      .send({ status: false, type: "VALIDATION", error: validationErr });
  }
});

module.exports = { productRouter };
