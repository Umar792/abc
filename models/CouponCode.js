const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CouponCodeSchema = new Schema(
  {
    promoCode: {
      type: String,
      required: [true, "Please enter promocode"],
    },
    discount: {
      type: String,
      required: [true, "Please enter discount price"],
    },
    author: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const CouponCodeModal = mongoose.model("CouponCode", CouponCodeSchema);
module.exports = CouponCodeModal;
