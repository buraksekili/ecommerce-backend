const express = require("express");
const { User } = require("../db");
const { validateReqBody, getErrors } = require("../helpers");

const signupRouter = express.Router();

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

module.exports = { signupRouter };
