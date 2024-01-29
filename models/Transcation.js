const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TranscationSchema = new Schema({
  transactionId: {
    type: String,
    required: [true, "Plaese Enter Your Transaction Id"],
  },
  orderId: {
    type: String,
    required: [true, "Plaese Enter Your Order Id"],
  },
  orderAmount: {
    type: String,
    required: [true, "Plaese Enter Your Order Amount"],
  },
  transactionAmount: {
    type: String,
    required: [true, "Plaese Enter Your transaction Amount"],
  },
  transactionStatus: {
    type: String,
    required: [true, "Plaese Enter Your transaction Status"],
  },
  eventVenue: {
    type: String,
  },
  eventDetails: {
    type: String,
    required: true,
  },
  eventDate: { type: Date, required: true },
  orderStatus: { type: String, required: [true, "Plaese Enter Order Status"] },
  eventName: {
    type: String,
  },
  row: { type: String },
  quantity: { type: String },
  user_id: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});

const TransactionModal = mongoose.model("Transaction", TranscationSchema);
module.exports = TransactionModal;
