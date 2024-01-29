const express = require("express");
const router = express.Router();
const controller = require("../Controllers/PaymentController");
const TokenVerify = require("../middleware/TokenVerify");

router.get("/generateClient", TokenVerify, controller.generateToken);

module.exports = router;
