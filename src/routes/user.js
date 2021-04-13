const express = require("express");
const { User } = require("../db/");
const { getErrors } = require("../helpers");
const userRouter = express.Router();

userRouter.get("/admin/users", async (req, res) => {
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

// userRouter.get("/api/comments", async (req, res) => {
//   try {
//     const comments = await CommentModel.find({});
//     return res.send({ status: true, comments });
//   } catch (error) {
//     const validationErr = getErrors(error);
//     return res
//       .status(401)
//       .send({ status: false, type: "VALIDATION", error: validationErr });
//   }
// });

// userRouter.post("/api/comment", auth, async (req, res) => {
//   try {
//     const user = req.user;
//     const { productID, content } = req.body;

//     // Create new comment and save it
//     const comment = new CommentModel({ content, owner: user.username });

//     // Check the existence of the product
//     const product = await Product.findById(productID);
//     if (!product) {
//       throw new Error("No product found with " + productID);
//     }

//     // Add comment into the product's comments array and save it
//     product.comments.push(comment);
//     await comment.save();
//     await product.save();

//     return res.send({ status: true, comments: product.comments });
//   } catch (error) {
//     const validationErr = getErrors(error);
//     console.log("ERROR", validationErr);
//     return res
//       .status(401)
//       .send({ status: false, type: "VALIDATION", error: validationErr });
//   }
// });

module.exports = { userRouter };
