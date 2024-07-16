const express = require("express");
const { v4: uuid } = require("uuid");
const SimpleWebAuthnServer = require("@simplewebauthn/server");
const { isoUint8Array } = require("@simplewebauthn/server/helpers");

const db = require("./db");
const { RP_NAME } = require("./constants");

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

  // TODO: Start a WebAuthn registration flow
  const options = {
    rpName: RP_NAME,
    rpID: req.hostname,
    userID: isoUint8Array.fromUTF8String(user.id),
    userName: user.email,
    userDisplayName: user.name,
    timeout: 60000, // 1 Minute
    attestationType: "none",
    excludeCredentials: [],
    authenticatorSelection: {
      userVerification: "preferred",
      residentKey: "required",
    },
    supportedAlgorithmIDs: [-7, -257],
  };

  const registrationOptions =
    await SimpleWebAuthnServer.generateRegistrationOptions(options);
  user.challenge = registrationOptions.challenge;

  db.users.push(user);

  return res.json(registrationOptions);
});

signup.post("/finish", async (req, res) => {
  throw new Error("Not implemented");
});

module.exports = signup;
