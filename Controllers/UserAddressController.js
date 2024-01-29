const UserAddress = require("../models/UserAddress");
const UserModal = require("../models/UserModal");
const ErrorHandler = require("../utils/errorHandler");

module.exports = {
  // --- creaete User Address ---
  CreateAddress: async (req, res, next) => {
    try {
      const {
        Address1,
        Address2,
        City,
        State,
        ZipCode,
        Country,
        phoneNumber,
        email,
        FullName,
      } = req.body;
      // Validation for Address1
      if (!Address1) {
        throw new Error("Plaese Enter Address1");
      }
      if (!City) {
        throw new Error("Plaese Enter City");
      }
      if (!email) {
        throw new Error("Plaese Enter Email");
      }

      if (!State) {
        throw new Error("Plaese Enter State");
      }

      if (!ZipCode) {
        throw new Error("Plaese Enter ZipCode");
      }
      if (!Country) {
        throw new Error("Plaese Enter Country");
      }
      if (!phoneNumber) {
        throw new Error("Plaese Enter phoneNumber");
      }
      if (!FullName) {
        throw new Error("Plaese Enter FullName");
      }

      //   ---- create the Address now
      const User = await UserModal.findById(req.user._id);
      if (!User) {
        return next(
          new ErrorHandler("User not found, Please Login Again", 400)
        );
      }

      const Address = await UserAddress.create({
        FullName,
        Address1,
        Address2,
        phoneNumber,
        email,
        City,
        State,
        Country,
        ZipCode,
        user: req.user._id,
      });
      res.status(200).json({
        success: true,
        message: "Your Address Created successfully",
        Address,
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  },
  // ---------- get All Adrees of the User
  UserAddress: async (req, res, next) => {
    try {
      const Addresses = await UserAddress.find({
        user: req.user?._id,
      });
      res.status(200).json({
        success: true,
        Addresses,
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  },
};
