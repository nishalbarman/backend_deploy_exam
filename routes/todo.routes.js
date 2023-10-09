const jwt = require("jsonwebtoken");
const express = require("express");

const { Router } = require("express");
const router = Router();
const SECRET = process.env.JWT_SECRET;


module.exports = router;
