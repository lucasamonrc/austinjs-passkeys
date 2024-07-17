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

  const signinOptions =
    await SimpleWebAuthnServer.generateAuthenticationOptions({
      timeout: 60_000,
      allowCredentials: user.devices.map((device) => ({
        id: device.credentialID,
        transports: device.transports,
      })),
      userVerification: "required",
      rpID: req.hostname,
    });

  user.challenge = signinOptions.challenge;

  return res.json(signinOptions);
});

signin.post("/finish", async (req, res) => {
  const { email, data } = req.body;

  const user = db.users.find((user) => user.email === email);

  if (!user) {
    return res.status(400).json({ message: "Cannot sign in this user" });
  }

  const expectedChallenge = user.challenge;

  const authenticator = user.devices.find(
    (device) => device.credentialID === data.rawId
  );

  if (!authenticator) {
    return res.status(400).send({ message: "Authenticator is not registered" });
  }

  let verification;
  try {
    verification = await SimpleWebAuthnServer.verifyAuthenticationResponse({
      response: data,
      expectedChallenge: `${expectedChallenge}`,
      expectedOrigin: ORIGIN,
      expectedRPID: req.hostname,
      authenticator: {
        ...authenticator,
      },
      requireUserVerification: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: error.toString() });
  }

  const { verified, authenticationInfo } = verification;

  if (verified) {
    authenticator.counter = authenticationInfo.newCounter;
  }

  delete user.challenge;

  return res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
});

module.exports = signin;
