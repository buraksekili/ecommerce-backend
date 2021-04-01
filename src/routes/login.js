const express = require("express");
const User = require("../db/models/User");
const { validateReqBody, getErrors } = require("../helpers");

const loginRouter = express.Router();

loginRouter.post("/api/login", async (req, res) => {
  const { userEmail, password } = req.body;

  if (!validateReqBody(userEmail, password)) {
    return res
      .status(401)
      .send({ status: false, type: "INVALID", error: "invalid request body" });
  }
  try {
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

module.exports = { loginRouter };
