const express = require("express");
const morgan = require("morgan");
const {
  signupRouter,
  loginRouter,
  productRouter,
  userRouter,
} = require("./routes");
const { connectDB } = require("./db");

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(morgan("dev"));

// Routers
app.use("/", signupRouter);
app.use("/", loginRouter);
app.use("/", productRouter);
app.use("/admin", userRouter);

if (process.env.NODE_ENV !== "test") {
  connectDB();
  app.listen(port, () => console.log("Server is running on", port));
}

module.exports = app;
