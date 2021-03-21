const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    trim: true,
    required: [true, "Password is required"],
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true,
  },
});

UserSchema.pre("save", async function (next) {
  const user = await User.findOne({ email: this.email });
  if (user) {
    next(new Error(`${this.email} already taken`));
    return;
  }

  const user1 = await User.findOne({ username: this.username });
  if (user1) {
    next(new Error(`${this.username} already taken`));
    return;
  }

  next();
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
