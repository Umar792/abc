const express = require("express");
const router = express.Router();
const tokenVerify = require("../middleware/TokenVerify");
const controller = require("../Controllers/OrderController");
const AdminVerify = require("../middleware/AdminVerify");

router.post("/create", tokenVerify, controller.createOrder);

router.post("/get/all", tokenVerify, controller.getUserOrders);

router.post(
  "/printEticket/:orderId/:itemId",
  tokenVerify,
  controller.printEticket
);

// ------ Admin Routes
router.get(
  "/admin/orders",
  tokenVerify,
  AdminVerify("admin"),
  controller.getAllOrdersForAdmin
);

// ---- print
router.post("/print/:orderId/:itemId", controller.printEticket);

// ---- create shipment
router.post("/Createshipment", controller.CreateShipMent);

// ---- get pass in google valut
router.post("/GetPassInGoogleWallet", controller.GetPassToGoogleWallet);

module.exports = router;
