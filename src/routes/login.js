const express = require("express");
const mongoose = require("mongoose");
const User = require("../db/models/User");
const bcrypt = require("bcrypt");

const loginRouter = express.Router();

loginRouter.get("/api/login2", (req, res) => res.send("In Login"));

loginRouter.post("/api/login", async (req, res) => {
  const { userEmail, password} = req.body;

  if (!validateReqBody(userEmail, password)) {
    return res
      .status(401)
      .send({ status: false, type: "INVALID", error: "invalid request body" });
  }
  try {

    const newUser = new User({
        email: userEmail,
        password: password,
    });
    await User.findByCredentials(userEmail, password);
} catch (error) {
    const validationErr = getErrors(error);
    console.log(validationErr);
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



module.exports = { loginRouter };
