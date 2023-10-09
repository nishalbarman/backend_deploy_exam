const { User } = require("../models/model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { Router } = require("express");
const router = Router();

const SECRET = process.env.JWT_SECRET;

router.post("/signup", async (req, res) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    req.body.password = hash;
    const user = new User(req.body);
    await user.save();
    res.status(201).send({ message: "User Created!" });
  } catch (er) {
    res.status(500).send({ message: "Internal server error!" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(403).send({ message: "Invalid Credentials" });
    }
    const hashed_pass = user.password;
    const result = bcrypt.compareSync(req.body.password, hashed_pass);
    if (!result) {
      return res.status(403).send({ message: "Invalid Credentials" });
    }

    const token = jwt.sign({ _id: user._id, email: user.email }, SECRET);
    res.status(200).send({ token: token, message: "Login Successful!" });
  } catch (er) {
    res.status(500).send({ message: "Internal server error!" });
  }
});

module.exports = router;
