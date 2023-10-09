const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  taskname: { type: String, required: true },
  status: { type: Boolean, default: false },
  tag: { type: String, required: true },
  user: { type: mongoose.Types.ObjectId, required: true },
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  IP: { type: String, required: true },
});

const Todo = mongoose.model("todo", todoSchema);
const User = mongoose.model("users", userSchema);

module.exports = { Todo, User };
