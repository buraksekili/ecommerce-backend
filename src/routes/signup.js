const express = require("express");
const mongoose = require("mongoose");
const User = require("../db/models/User");

const signupRouter = express.Router();

signupRouter.get("/", (req, res) => res.send("hello"));

signupRouter.post("/api/signup", async (req, res) => {
  const { userEmail, password, username } = req.body;

  if (!validateReqBody(userEmail, password, username)) {
    return res
      .status(401)
      .send({ status: false, type: "INVALID", error: "invalid request body" });
  }

  try {
    const newUser = new User({
      email: userEmail,
      password: password,
      username: username,
    });
    await newUser.save();
  } catch (error) {
    const validationErr = getErrors(error);
    return res
      .status(401)
      .send({ status: false, type: "VALIDATION", error: validationErr });
  }

  res.send({ status: true });
});

// Validates request body
const validateReqBody = (...req) => {
  for (r of req) {
    if (!r || r.trim().length == 0) {
      return false;
    }
  }
  return true;
};

// Checks errors returning from DB
const getErrors = (error) => {
  if (error instanceof mongoose.Error.ValidationError) {
    let validationErr = "";
    for (field in error.errors) {
      validationErr += `${field} `;
    }
    return validationErr.substring(0, validationErr.length - 1);
  }
  return error.message;
};

module.exports = { signupRouter };
