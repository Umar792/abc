const express = require("express");
const router = express.Router();

const eventRoutes = require("./Event");
const userRoutes = require("./User");
const orderRoutes = require("./Order");
const paymentRoutes = require("./Payment");
const carouselRoutes = require("./Crousal");
const couponCodeRoutes = require("./CouponCode");
const transactionRoutes = require("./TicketEvoulation");

router.use("/event", eventRoutes);
router.use("/user", userRoutes);
router.use("/order", orderRoutes);
router.use("/payment", paymentRoutes);
router.use("/carousal", carouselRoutes);
router.use("/couponcode", couponCodeRoutes);
router.use("/transcation", transactionRoutes);

module.exports = router;
