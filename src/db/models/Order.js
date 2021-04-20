const mongoose = require("mongoose");
const { ProductSchema } = require("./Product");
const Schema = mongoose.Schema;
const OrderSchema = new Schema(
  {
    product: ProductSchema,
    status: Boolean,
  },
  { versionKey: false }
);

const Order = mongoose.model("Order", OrderSchema);
module.exports = { Order, OrderSchema };
