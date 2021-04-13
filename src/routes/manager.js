const express = require("express");
const { User, Product } = require("../db/");
const { getErrors, validateReqBody } = require("../helpers");
const managerRouter = express.Router();

managerRouter.post("/signup", async (req, res) => {
  const { userEmail, password, username, userType } = req.body;
  if (userType <= 0 || userType > 2) {
    return res
      .status(401)
      .send({ status: false, type: "INVALID", error: "invalid userType" });
  }

  if (!validateReqBody(userEmail, password, username)) {
    return res
      .status(401)
      .send({ status: false, type: "INVALID", error: "invalid request body" });
  }

  try {
    // Create user object to save
    let newUser = new User({ userEmail, password, username });

    // Get JWT for the user and update token field of the new user.
    // Then, save updated user.
    const token = await newUser.getJWT();
    newUser.token = token;
    newUser.userType = userType;
    await newUser.save();

    // Convert User to object in order to delete password field.
    // So that client does not see user's password while returning through response.
    newUser = newUser.toObject();
    delete newUser.password;

    res.send({ status: true, user: newUser });
  } catch (error) {
    console.log("error: ", error.message);
    const validationErr = getErrors(error);
    return res
      .status(401)
      .send({ status: false, type: "VALIDATION", error: validationErr });
  }
});

managerRouter.put("/sm/product/:_id", async (req, res) => {
  const { unitPrice, previousPrice } = req.body;
  const { _id } = req.params;

  if (!_id) {
    return res.status(401).send({
      status: false,
      type: "INVALID",
      error: "invalid request body",
    });
  }
  try {
    let product;
    if (unitPrice && previousPrice) {
      product = await Product.findOneAndUpdate(_id, {
        unitPrice,
        previousPrice,
      });
      product = { ...product.toObject(), unitPrice, previousPrice };
    } else if (unitPrice && !previousPrice) {
      product = await Product.findOneAndUpdate(_id, { unitPrice });
      product = { ...product.toObject(), unitPrice };
    } else if (!unitPrice && previousPrice) {
      product = await Product.findOneAndUpdate(_id, { previousPrice });
      product = { ...product.toObject(), previousPrice };
    } else {
      return res.status(401).send({
        status: false,
        type: "INVALID",
        error: "invalid request body for salemanager",
      });
    }

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

managerRouter.put("/pm/product/:_id", async (req, res) => {
  const { stock } = req.body;
  const { _id } = req.params;

  if (!_id || !stock) {
    return res.status(401).send({
      status: false,
      type: "INVALID",
      error: "invalid request body",
    });
  }
  try {
    let product = await Product.findOneAndUpdate(_id, { stock });
    if (!product) {
      return res.status(404).send({ status: false, _id });
    }
    product = {...product.toObject(), stock}

    return res.status(201).send({ status: true, product });
  } catch (error) {
    const validationErr = getErrors(error);
    console.log(validationErr);
    return res
      .status(401)
      .send({ status: false, type: "VALIDATION", error: validationErr });
  }
});

module.exports = { managerRouter };
