const UserModal = require("../models/UserModal");
const ErrorHandler = require("../utils/errorHandler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

module.exports = {
  // ----- User Registration
  UserRegisration: async (req, res, next) => {
    try {
      //   -- get Data from the body
      const { firstName, lastName, phoneNumber, email, password } = req.body;
      if (!firstName) {
        return next(new ErrorHandler("Plaese Enter Your First Name", 400));
      }
      // if (!lastName) {
      //   return next(new ErrorHandler("Plaese Enter Your Last Name", 400));
      // }
      if (!phoneNumber) {
        return next(new ErrorHandler("Plaese Enter Your Mobile Number", 400));
      }
      if (!email) {
        return next(new ErrorHandler("Plaese Enter Your Email Address", 400));
      }
      if (!password) {
        return next(new ErrorHandler("Plaese Enter Your password", 400));
      }

      //   ----------- know check is User Already Registered
      const isUser = await UserModal.findOne({ email });
      if (isUser) {
        if (req.file) {
          const file = req.file.filename;
          const filepath = path.join(__dirname, "../uploads", file);
          fs.unlink(filepath, (err) => {
            if (err) {
              console.log(`Error in file deleting ${err}`);
              // res.status(400).json({ message: "Error in file deleting" });
            } else {
              console.log("file deleted successfuly");
              // res.status(400).json({ message: "file deleting" });
            }
          });
        }
        return next(
          new ErrorHandler(`Email Already Present Please Login`, 400)
        );
      }

      // --- know check is Aavatar is present
      if (req.file) {
        const file = req.file.filename;
        var fileUrl = path.join(file);
        // console.log(fileUrl);
      }
      //   ---- if not of user then create new User
      const user = await UserModal.create({
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        Avatar: fileUrl,
      });
      res.status(200).json({
        success: true,
        message: `Registration Successfully`,
        user: user,
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  },

  // ---- user login
  UserLogin: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      // -- check if user not put email or password
      if (!email) {
        return next(new ErrorHandler("Plaese Enter Your Email Address", 400));
      }
      if (!password) {
        return next(new ErrorHandler("Plaese Enter Your password", 400));
      }

      // --- check is email Already present in out dataBse
      const isEmail = await UserModal.findOne({ email });
      if (!isEmail) {
        return next(
          new ErrorHandler("Invalid Credentials, Please try again", 400)
        );
      }
      // --- if email then compare the password
      const isMatch = await bcrypt.compare(password, isEmail.password);
      if (!isMatch) {
        return next(
          new ErrorHandler("Invalid Credentials, Please try again", 400)
        );
      }
      const Token = await jwt.sign({ id: isEmail.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
      });
      res.status(200).json({
        success: true,
        message: "Login Successfully",
        Token,
        user: isEmail,
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  },

  // --- user verify
  VerifyUser: async (req, res, next) => {
    try {
      const User = await UserModal.findById(req.user._id);
      if (!User) {
        return next(new ErrorHandler("User not found, Please try again", 400));
      }
      res.status(200).json({
        success: true,
        User,
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  },

  // ---- update Password
  UpdatePassword: async (req, res, next) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const User = await UserModal.findById(req.user._id);
      if (!User) {
        return next(new ErrorHandler("User not found, Please try again", 400));
      }
      if (!oldPassword) {
        return next(new ErrorHandler("Plaese Enter Your Old Password", 400));
      }
      if (!newPassword) {
        return next(new ErrorHandler("Plaese Enter Your New Password", 400));
      }
      // ------------------- now check the old password
      const isMatch = await bcrypt.compare(oldPassword, User?.password);
      if (!isMatch) {
        return next(new ErrorHandler("Old Password Is Invalid", 400));
      }
      User.password = newPassword;
      await User.save();
      res.status(200).json({
        success: true,
        message: `Password Chnaged Successfully`,
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  },

  // ---- update profile
  UpdateProfile: async (req, res, next) => {
    try {
      const User = await UserModal.findById(req.user._id);
      if (!User) {
        return next(new ErrorHandler("User not found, Please try again", 400));
      }
      const UpdateUser = await UserModal.findByIdAndUpdate(
        req.user._id,
        req.body,
        {
          new: true,
        }
      );
      res.status(200).json({
        success: true,
        message: "User updated successfully",
        UpdateUser,
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  },

  // ---------------- Get All Users for Admin
  AllUsersForAdmin: async (req, res, next) => {
    try {
      const users = await UserModal.find();
      res.status(200).json({
        success: true,
        users,
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  },
};
