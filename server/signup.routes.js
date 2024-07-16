const express = require("express");
const { v4: uuid } = require("uuid");
const db = require("./db");

const signup = express.Router();

signup.use(express.json());

signup.post("/start", async (req, res) => {
  const { email, name } = req.body;

  const dbUser = db.users.find((user) => user.email === email);

  if (dbUser) {
    return res
      .status(400)
      .json({ message: "This email is already registered" });
  }

  const user = {
    id: uuid(),
    name,
    email,
  };

  db.users.push(user);

  // TODO: Start a WebAuthn registration flow

  return res.status(201).json(user);
});

signup.post("/finish", async (req, res) => {
  throw new Error("Not implemented");
});

module.exports = signup;
