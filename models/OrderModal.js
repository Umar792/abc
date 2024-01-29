const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    totalAmount: {
      type: Number,
      required: [true, "Please enter total amount"],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },

    items: [
      {
        ticket_group_id: {
          type: Number,
          required: [true, "Plaese Enter Ticket Group ID"],
        },
        splits: {
          type: Number,
          required: [true, "Plaese Enter Ticket Splits"],
        },
        price: {
          type: Number,
          required: [true, "Plaese Enter Ticket Price"],
        },
        name: {
          type: String,
          required: [true, "Plaese Enter Ticket Name"],
        },
      },
    ],
    type: {
      type: String,
      required: [true, "Plaese Enter Ticket Type"],
    },
    shiptoName: {
      type: String,
      required: [true, "Plaese Enter Shipto Name"],
    },
    shiptoEmail: {
      type: String,
      required: [true, "Plaese Enter Shipto Email"],
    },
    status: {
      type: String,
      default: "Pending",
    },
    payments: {
      type: String,
      required: [true, "Please enter payment type"],
    },
    service_fee: {
      type: Number,
      required: [true, "Please enter service fee"],
    },
    tax: {
      type: Number,
      required: [true, "Please enter tax ammount"],
    },
    order_Id: {
      type: Number,
      required: [true, "Please Enter Order Id"],
    },
  },
  {
    timestamps: true,
  }
);

const OrderModal = mongoose.model("OrderModal", OrderSchema);
module.exports = OrderModal;
