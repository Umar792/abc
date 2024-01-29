const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserAddressSchema = new Schema(
  {
    Address1: {
      type: String,
      required: [true, "Please Enter Your Address 1"],
    },
    Address2: {
      type: String,
    },
    City: {
      type: String,
      required: [true, "Please Enter Your City Name"],
    },
    State: {
      type: String,
      required: [true, "Please Enter Your State Name"],
    },
    ZipCode: {
      type: Number,
      required: [true, "Please Enter Your ZipCode"],
    },
    Country: {
      type: String,
      required: [true, "Please Enter Your Country Name"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Please Enter Your Mobile Number"],
    },
    email: {
      type: String,
      required: [true, "Please Enter Your Email Address"],
    },
    FullName: {
      type: String,
      required: [true, "Please Enter Your First Name"],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const UserAddress = mongoose.model("UserAddress", UserAddressSchema);
module.exports = UserAddress;
