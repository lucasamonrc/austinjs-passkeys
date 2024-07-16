const express = require("express");
const { v4: uuid } = require("uuid");
const SimpleWebAuthnServer = require("@simplewebauthn/server");
const { isoUint8Array } = require("@simplewebauthn/server/helpers");

const signup = express.Router();

const db = require("./db");
const { RP_NAME, ORIGIN } = require("./constants");

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

  // TODO: Generate a WebAuthn registration request flow

  user.challenge = {};

  db.users.push(user);

  return res.json({});
});

signup.post("/finish", async (req, res) => {
  const { email, data } = req.body;

  const user = db.users.find((user) => user.email === email);

  if (!user) {
    return res.status(404).json({ message: "User could not be found" });
  }

  const expectedChallenge = user.challenge;

  // TODO: Verify the WebAuthn registration response

  delete user.challenge;

  return res.status(204).send();
});

module.exports = signup;
