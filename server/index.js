const express = require("express");
const session = require("express-session");

const signinRouter = require("./signin.routes");
const signupRouter = require("./signup.routes");

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "dev",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

app.get("/api/healthcheck", (_, res) => {
  return res.status(200).send("ok");
});

app.use("/api/signin", signinRouter);
app.use("/api/signup", signupRouter);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
