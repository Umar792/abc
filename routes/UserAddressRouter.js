const express = require("express");
const router = express.Router();
const controller = require("../Controllers/UserAddressController");
const TokenVerify = require("../middleware/TokenVerify");

// --- create address
router.post("/create", TokenVerify, controller.CreateAddress);

// --- get User All Address
router.post("/user/addresses", TokenVerify, controller.UserAddress);

module.exports = router;
