const express = require("express");
const router = express.Router();
const { sayHello } = require("../controller/user");

router.get("/", sayHello);

module.exports = router;
