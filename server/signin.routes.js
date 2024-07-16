const express = require("express");
const SimpleWebAuthnServer = require("@simplewebauthn/server");

const db = require("./db");
const { ORIGIN } = require("./constants");

const signin = express.Router();

signin.post("/start", async (req, res) => {
  const { email } = req.body;

  const user = db.users.find((user) => user.email === email);

  if (!user) {
    return res.status(400).json({ message: "Cannot sign in this user" });
  }

  // TODO: Implement generate verification request flow

  user.challenge = {};

  return res.json({});
});

signin.post("/finish", async (req, res) => {
  const { email, data } = req.body;

  const user = db.users.find((user) => user.email === email);

  if (!user) {
    return res.status(400).json({ message: "Cannot sign in this user" });
  }

  const expectedChallenge = user.challenge;

  // TODO: Implement passkey verification

  return res.json({});
});

module.exports = signin;
