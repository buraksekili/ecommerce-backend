const express = require("express");
const { Product, CommentModel } = require("../db/");
const { getErrors } = require("../helpers");
const auth = require("./middlewares/auth");
const commentsRouter = express.Router();

commentsRouter.put("/api/comments/:id", async (req, res) => {
  try {
    const { content, owner, approval } = req.body;
    const { id } = req.params;
    if (!id) {
      throw new Error(`invalid id ${id}`);
    }

    const newComment = { content, owner, approval };
    const comment = await CommentModel.findByIdAndUpdate(id, {
      $set: newComment,
    });
    if (!comment) {
      return res.status(404).send({ status: false, id });
    }

    return res.status(201).send({ status: true, newComment });
  } catch (error) {
    const validationErr = getErrors(error);
    return res
      .status(401)
      .send({ status: false, type: "VALIDATION", error: validationErr });
  }
});

commentsRouter.get("/api/comments", async (req, res) => {
  try {
    const comments = await CommentModel.find({});
    return res.send({ status: true, comments });
  } catch (error) {
    const validationErr = getErrors(error);
    return res
      .status(401)
      .send({ status: false, type: "VALIDATION", error: validationErr });
  }
});

commentsRouter.post("/api/comment", auth, async (req, res) => {
  try {
    const user = req.user;
    const { productID, content } = req.body;

    // Create new comment and save it
    const comment = new CommentModel({ content, owner: user.username });

    // Check the existence of the product
    const product = await Product.findById(productID);
    if (!product) {
      throw new Error("No product found with " + productID);
    }

    // Add comment into the product's comments array and save it
    product.comments.push(comment);
    await comment.save();
    await product.save();

    return res.send({ status: true, comments: product.comments });
  } catch (error) {
    const validationErr = getErrors(error);
    console.log("ERROR", validationErr);
    return res
      .status(401)
      .send({ status: false, type: "VALIDATION", error: validationErr });
  }
});

module.exports = { commentsRouter };
