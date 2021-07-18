const express = require("express");
const bodyParser = require("body-parser");
const dataRoutes = require("./api/data/data.router.js");

const port = process.env.port || 3001;

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api/data", dataRoutes);

app.listen(port, () => {
  console.log("Running on port", port);
});

app.get("/", (req, res, next) => {
  res.json({ message: "Hello World" });
});
