const express = require("express");
const { User } = require("../db/");
const { validateReqBody, getErrors } = require("../helpers");

const userRouter = express.Router();

userRouter.get("/users", async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    return res.send({ status: true, users });
  } catch (error) {
    const validationErr = getErrors(error);
    console.log(validationErr);
    return res
      .status(401)
      .send({ status: false, type: "VALIDATION", error: validationErr });
  }
});

module.exports = { userRouter };
