const express = require("express");
const parser = require("body-parser");
const api = require("./api.js");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(parser.json());
app.use(parser.urlencoded({ extended: false }));
app.use("/api", api);

app.listen(85, () => {
  console.log("server running at http://127.0.0.1:85");
});
