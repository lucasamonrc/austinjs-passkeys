const express = require("express");
const { v4: uuid } = require("uuid");
const db = require("./db");

const signup = express.Router();

signup.use(express.json());

signup.post("/start", async (req, res) => {
  throw new Error("Not implemented");
});

signup.post("/finish", async (req, res) => {
  throw new Error("Not implemented");
});

module.exports = signup;
