const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

app.post("/api/signup", async (req, res) => {
  const { userEmail, password, username } = req.body;

  const newUser = new User({
    email: userEmail,
    password: password,
    username: username,
  });

  try {
    await newUser.save();
  } catch (error) {
    console.log("error happened: ", error);
    res.status(500).send({ status: false, error: error });
  }
  res.send({ status: true });
});

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected"))
  .catch((e) => console.log("error:", e));

app.listen(port, () => console.log(`running on ${port}`));
