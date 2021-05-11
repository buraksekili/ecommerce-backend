const express = require("express");
const { User, Product, Order } = require("../db/");
const { getErrors } = require("../helpers");
const auth = require("./middlewares/auth");
const orderRouter = express.Router();

// Returns all orders with its details
orderRouter.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find({});
    res.send({ status: true, orders });
  } catch (error) {
    const validationErr = getErrors(error);
    console.log(validationErr);
    return res
      .status(401)
      .send({ status: false, type: "VALIDATION", error: validationErr });
  }
});

// Get orders of the user specified by 'id' param.
orderRouter.get("/api/orders/:id", async (req, res) => {
  try {
    // get user id
    const { id } = req.params;
    let user = await User.findById(id);
    if (!user) {
      throw new Error(`no such a user ${id}`);
    }
    user = user.toObject();
    const orders = user.orders;

    // Obtain details of order (status and produc fields)
    const details = [];
    for (order of orders) {
      if (order) {
        const detail = await Order.findById(order);
        details.push(detail);
      }
    }

    res.send({ status: true, orders: details });
  } catch (error) {
    const validationErr = getErrors(error);
    console.log(validationErr);
    return res
      .status(401)
      .send({ status: false, type: "VALIDATION", error: validationErr });
  }
});

// Add product to order of the user specified by req.body.token
orderRouter.post("/api/order", auth, async (req, res) => {
  try {
    const { address } = req.body;
    const userId = req.user._id;
    const orders = req.user.cart;

    // const orders = req.user.orders;
    if (!Array.isArray(orders)) {
      throw new Error("invalid user orders.");
    }

    let products = [];
    for (let pid of orders) {
      const prod = await Product.findById(pid);
      if (prod) {
        products.push(prod);
      }
    }

    // Create new order
    const newOrder = new Order({
      products,
      status: 0,
      address,
      customer: userId,
    });

    // Push new order to the user's 'orders'
    // User is obtained through JWT token.
    let user = req.user;
    user.orders.push(newOrder);

    // Save updated user and new order.
    user = await User.findByIdAndUpdate(userId, user, { new: true });
    await newOrder.save();

    res.send({ status: true, orders: user.toObject().orders });
  } catch (error) {
    const validationErr = getErrors(error);
    console.log(validationErr);
    return res
      .status(401)
      .send({ status: false, type: "VALIDATION", error: validationErr });
  }
});

// Update the order
orderRouter.put("/api/order/:oid", async (req, res) => {
  try {
    const oid = req.params.oid;
    const status = req.body.status;

    // Update order based on its ID.
    const newOrder = await Order.findByIdAndUpdate(
      oid,
      { status },
      { new: true }
    );
    if (!newOrder) {
      throw new Error(`cannot find order ${oid}`);
    }

    res.send({ status: true, order: newOrder });
  } catch (error) {
    const validationErr = getErrors(error);
    console.log(validationErr);
    return res
      .status(401)
      .send({ status: false, type: "VALIDATION", error: validationErr });
  }
});

// Delete the order
orderRouter.delete("/api/order/:oid", auth, async (req, res) => {
  try {
    const oid = req.params.oid;

    // Check if order is deleted successfully.
    const deleted = await Order.findByIdAndDelete(oid);
    if (!deleted) {
      throw new Error(`cannot delete order ${oid}`);
    }

    // Get user
    let user = await User.findById(req.user._id);
    // Delete order from its orders.
    const orders = user.orders;
    const updatedOrders = orders.filter((order) => {
      return order._id != oid;
    });
    // update user.orders and save it
    user.orders = updatedOrders;
    await User.findByIdAndUpdate(user._id, user, { new: true });
    res.send({ status: true, orders: updatedOrders });
  } catch (error) {
    const validationErr = getErrors(error);
    console.log(validationErr);
    return res
      .status(401)
      .send({ status: false, type: "VALIDATION", error: validationErr });
  }
});

module.exports = { orderRouter };
