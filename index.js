require("dotenv").config();
const express = require("express");
const cors = require("cors");
require("./connect");

const port = process.env.SERVER_PORT || 8000;

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

app.use("/auth", require("./routes/auth.routes"));
// app.use("/todo", require("./routes/todo.routes"));

const authMiddle = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    console.log(token);
    const decoded = jwt.verify(token, SECRET);
    req._id = decoded._id;
    req.email = decoded.email;
    next();
  } catch (error) {
    return res.send({ message: "Unauthorised access!" });
  }
};

const { User, Todo } = require("./models/model");

app.get("/todo", authMiddle, async (req, res) => {
  try {
    const todo = await Todo.find();
    res.status(200).send({ todo: todo });
  } catch (er) {
    console.log(er);
    res.status(500).send({ message: "Internal server error!" });
  }
});

app.post("/todo/add", async (req, res) => {
  try {
    console.log(res.body);
    const todo = new Todo(req.body);
    await todo.save();
    res.status(200).send({ message: "Todo Created!" });
  } catch (er) {
    // console.log(er);
    res.status(500).send({ message: "Internal server error!" });
  }
});

app.patch("/todo/update/:id", authMiddle, async (req, res) => {
  try {
    const id = req.params.id;
    const todo = Todo.findById(id);
    if (todo.user != req._id) {
      return res.send({ message: "Not authorised!" });
    }
    await User.updateOne({ _id: id }, req.body);
    res.status(200).send({ message: "Todo Updated!" });
  } catch (er) {
    res.status(500).send({ message: "Internal server error!" });
  }
});

app.delete("/todo/delete/:id", authMiddle, async (req, res) => {
  try {
    const id = req.params.id;
    const todo = Todo.findById(id);
    if (todo.user != req._id) {
      return res.send({ message: "Not authorised!" });
    }
    await User.deleteOne({ _id: id });
    res.status(200).send({ token: token, message: "Todo Deleted!" });
  } catch (er) {
    res.status(500).send({ message: "Internal server error!" });
  }
});

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`);
});
