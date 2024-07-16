const express = require("express");

const app = express();

app.get("/api", (req, res) => {
  return res.send("hello, client!");
});

app.listen(8080, () => console.log("Listening on port 8080"));
