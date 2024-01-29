const express = require("express");
const router = express.Router();
const tokenVerify = require("../middleware/TokenVerify");
const controller = require("../Controllers/OrderController");

router.post("/create", tokenVerify, controller.createOrder);

router.post("/get/all", tokenVerify, controller.getUserOrders);

module.exports = router;
