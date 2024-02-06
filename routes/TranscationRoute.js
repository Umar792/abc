const express = require("express");
const router = express.Router();
const controller = require("../Controllers/TranscationController");
const TokenVerify = require("../middleware/TokenVerify");

router.get("/create", TokenVerify, controller.createtranscation);

router.post("/get/all/transcation", TokenVerify, controller.allTrnscations);

router.get("/all/:id", controller.findAll);

router.get("/details/:id", controller.EventDetails);

router.get("/event/details/:id", controller.TicketGroup);

router.get("/event/search/:name", controller.EventSearch);

router.get("/event/category/:id", controller.EventSearchByCategory);

router.post("/order/create", controller.createOrder);

router.post("/order/create/multiple", controller.createOrdermultiple);

router.post("/client/create", controller.createClient);

router.get("/comp", controller.allcompanies);

router.get("/image", controller.getImageurl);

module.exports = router;
