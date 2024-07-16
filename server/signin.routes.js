const express = require("express");
const db = require("./db");

const signin = express.Router();

signin.use(express.json());

signin.post("/start", async (req, res) => {
  throw new Error("Not implemented");
});

signin.post("/finish", async (req, res) => {
  throw new Error("Not implemented");
});

module.exports = signin;
