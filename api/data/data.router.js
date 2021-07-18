const router = require("express").Router();
const {
  getData
} = require("./data.controller");

router.get("/", getData);

module.exports = router;
