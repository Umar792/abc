const CouponCodeModal = require("../models/CouponCode");
const ErrorHandler = require("../utils/errorHandler");

module.exports = {
  // -- create coupon code
  CreateCopenCode: async (req, res, next) => {
    try {
      const { promoCode, discount } = req.body;
      if (!promoCode) {
        return next(new ErrorHandler("Please Enter CouponCode", 400));
      }
      if (!discount) {
        return next(new ErrorHandler("Please Enter Dicount Price", 400));
      }

      // --- hceck is coupon code already present
      const IsCouponCode = await CouponCodeModal.findOne({
        promoCode: promoCode,
      });
      if (IsCouponCode) {
        return next(new ErrorHandler("CouponCode Already Exist", 400));
      }

      await CouponCodeModal.create({
        discount: discount,
        promoCode: promoCode,
        author: req.user._id,
      });

      //   --- get all coupon code
      const CouponCodes = await CouponCodeModal.find().populate("author");
      res.status(200).json({
        success: true,
        message: "Coupon Code Created Successfully",
        CouponCodes,
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  },

  //   ---- get all coupon code
  GetAllCouponCodes: async (req, res, next) => {
    try {
      const CouponCodes = await CouponCodeModal.find().populate("author");
      res.status(200).json({
        success: true,
        CouponCodes,
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  },

  //   --- update coupon code

  UpdateCouponCode: async (req, res, next) => {
    try {
      const { promoCode, discount } = req.body;
      const couponId = req.params.id;
      const updatedCoupon = await CouponCodeModal.findById(couponId);
      if (!updatedCoupon) {
        return next(new ErrorHandler("Coupon not found", 400));
      }
      if (promoCode) {
        updatedCoupon.promoCode = promoCode;
      }

      if (discount) {
        updatedCoupon.discount = discount;
      }
      await updatedCoupon.save();

      //   --- get all coupon code
      const CouponCodes = await CouponCodeModal.find().populate("author");
      res.status(200).json({
        success: true,
        message: "Coupon Code Updated Successfully",
        CouponCodes,
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  },

  // Delete coupon code
  DeleteCouponCode: async (req, res, next) => {
    try {
      const couponId = req.params.id;
      const deletedCoupon = await CouponCodeModal.findByIdAndDelete(couponId);

      if (!deletedCoupon) {
        return next(new ErrorHandler("Coupon not found", 400));
      }

      //   --- get all coupon code
      const CouponCodes = await CouponCodeModal.find().populate("author");
      res.status(200).json({
        success: true,
        message: "Coupon Code Deleted Successfully",
        CouponCodes,
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  },

  // Apply coupon code
  ApplyCouponCode: async (req, res, next) => {
    try {
      const { couponCode } = req.body;

      if (!couponCode) {
        return next(new ErrorHandler("Please Enter Coupon Code", 400));
      }

      // Find the coupon code in the database
      const coupon = await CouponCodeModal.findOne({ promoCode: couponCode });

      if (!coupon) {
        return next(new ErrorHandler("Invalid Coupon Code", 400));
      }
      res.status(200).json({
        success: true,
        message: "Coupon Code Applied Successfully",
        coupon,
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  },
};
