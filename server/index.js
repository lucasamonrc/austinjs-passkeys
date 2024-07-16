const express = require("express");

const signinRouter = require("./signin.routes");
const signupRouter = require("./signup.routes");

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());

app.use("/api/signin", signinRouter);
app.use("/api/signup", signupRouter);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
