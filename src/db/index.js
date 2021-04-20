module.exports = {
  ...require("./models/User"),
  ...require("./models/Product"),
  ...require("./models/Order"),
  ...require("./connect"),
};
