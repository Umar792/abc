const UserModal = require("../models/UserModal");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");

const TokenVerify = async (req, res, next) => {
  try {
    const token = req.headers["token"];
    if (!token) {
      return next(new ErrorHandler("Token Not Present In Headers", 400));
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = await UserModal.findById(decoded.id);
    if (!req.user) {
      return next(new ErrorHandler("User not found, Please Login Again", 400));
    }
    next();
  } catch (error) {
    next(new ErrorHandler(error.message, 400));
  }
};

module.exports = TokenVerify;
