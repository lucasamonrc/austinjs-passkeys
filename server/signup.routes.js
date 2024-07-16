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
  const { email, data } = req.body;

  const user = db.users.find((user) => user.email === email);

  if (!user) {
    return res.status(404).json({ message: "User could not be found" });
  }

  const expectedChallenge = user.challenge;

  let verification;
  try {
    const options = {
      response: data,
      expectedChallenge: `${expectedChallenge}`,
      expectedOrigin: "http://localhost:3000",
      expectedRPID: req.hostname,
      requireUserVerification: true,
    };
    verification = await SimpleWebAuthnServer.verifyRegistrationResponse(
      options
    );
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: error.toString() });
  }

  const { verified, registrationInfo } = verification;

  if (verified && registrationInfo) {
    const { credentialPublicKey, credentialID, counter } = registrationInfo;

    const newDevice = {
      credentialPublicKey,
      credentialID,
      counter,
      transports: data.response.transports,
    };
    if (user.devices == undefined) {
      user.devices = [];
    }
    user.webauthn = true;
    user.devices.push(newDevice);
  }

  user.challenge = "";

  return res.status(204).send();
});

module.exports = signup;
