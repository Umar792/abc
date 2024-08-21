const express = require("express");
const router = express.Router();
const controller = require("../Controllers/PaymentController");
const TokenVerify = require("../middleware/TokenVerify");

router.get("/generateClient", controller.generateToken);
router.post("/process/payment", controller.paymentProcess);

module.exports = router;
