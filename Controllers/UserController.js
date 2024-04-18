const UserModal = require("../models/UserModal");
const ErrorHandler = require("../utils/errorHandler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const TevoClient = require("ticketevolution-node");
// const API_TOKEN = "eebbfa6848026f8e3f6b1ac5f87e1e46";
// const API_SECRET_KEY = "iEzrOJOJ0RTDqRXOnHAZX5ceyfdGITbNy1qd2EXV";
const API_TOKEN = "10cbbac87aa33cf9818fc1046bca0044";
const API_SECRET_KEY = "7bThxZPz3L+KdAdGsjcM9c99mCoyvXt3jH2MDy0/";
const X_Signature = "z0g8oHXZyOi7Is0qM0KWVvgY9VQLRSadommuh0q6nuQ=";
const moment = require("moment");
const S3Client = require("./s3_list");
const Promise = require("bluebird");
const SendEmail = require("../middleware/SendEmail");

const tevoClient = new TevoClient({
  apiToken: API_TOKEN,
  apiSecretKey: API_SECRET_KEY,
});

module.exports = {
  // ----- User Registration
  UserRegisration: async (req, res, next) => {
    try {
      //   -- get Data from the body
      const { firstName, lastName, phoneNumber, email, password } = req.body;
      if (!firstName) {
        return next(new ErrorHandler("Plaese Enter Your First Name", 400));
      }
      if (!lastName) {
        return next(new ErrorHandler("Plaese Enter Your Last Name", 400));
      }
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

      // ========== create client in ticket Evoulation api
      // var client_id;
      const requestBody = {
        clients: [
          {
            // office_id: 8918 ,
            office_id: 3161,
            name: firstName,
            email_addresses: [
              {
                address: email,
              },
            ],
            addresses: [
              {
                region: "NJ",
                country_code: "US",
                postal_code: "07307",
                street_address: "333 Washington St Suite 302",
                locality: "Jersey City",
              },
            ],
          },
        ],
      };
      const url = "https://api.sandbox.ticketevolution.com/v9/clients";
      tevoClient
        .postJSON(url, requestBody)
        .then(async (json) => {
          console.log(json.clients[0]?.id);
          // return res.send(json);
          var client_id = json.clients[0]?.id;
          var email_addressesId = json.clients[0]?.email_addresses[0]?.id;
          //   ---- if not of user then create new User
          const user = await UserModal.create({
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            Avatar: fileUrl,
            clientId: client_id,
            emailAddressId: email_addressesId,
          });
          res.status(200).json({
            success: true,
            message: `Registration Successfully`,
            user: user,
          });
        })
        .catch((error) => {
          return next(new ErrorHandler(error.message, 400));
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

  UpdateProfile: async (req, res, next) => {
    try {
      const user = await UserModal.findById(req.user._id);

      if (!user) {
        return next(new ErrorHandler("User not found, Please try again", 400));
      }

      const updatedUser = await UserModal.findByIdAndUpdate(
        req.user._id,
        req.body,
        {
          new: true,
        }
      );

      if (req.file) {
        const userAvatar = user?.Avatar;

        if (userAvatar) {
          const filepath = path.join(__dirname, "../uploads", userAvatar);

          fs.unlink(filepath, async (err) => {
            if (err) {
              console.log(`Error in file deleting ${err}`);
              // return res
              //   .status(400)
              //   .json({ message: "Error in file deleting" });
            }

            console.log("File deleted successfully");
            const file = req.file.filename;
            const fileUrl = path.join(file);
            user.Avatar = fileUrl;
            await user.save();

            res.status(200).json({
              success: true,
              message: "User updated successfully",
              updatedUser,
            });
          });
        } else {
          const file = req.file.filename;
          const fileUrl = path.join(file);
          user.Avatar = fileUrl;
          await user.save();

          res.status(200).json({
            success: true,
            message: "User updated successfully",
            updatedUser,
          });
        }
      } else {
        // If there's no file, respond without file handling
        res.status(200).json({
          success: true,
          message: "User updated successfully",
          updatedUser,
        });
      }
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

  // ---- delete user profile --- admin route
  DeleteUserProfiel: async (req, res, next) => {
    try {
      const user = await UserModal.findById(req.params.id);
      if (!user) {
        return next(
          new ErrorHandler(`User not found at this id ${req.params.id}`, 400)
        );
      }
      await UserModal.findByIdAndDelete(req.params.id);
      const users = await UserModal.find();
      res.status(200).json({
        success: true,
        message: "User deleted successfully",
        users,
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  },
  // ------ update user role
  RoleUpdate: async (req, res, next) => {
    try {
      const user = await UserModal.findById(req.body.id);
      if (!user) {
        return next(
          new ErrorHandler(`User not found at this id ${req.params.id}`, 400)
        );
      }

      user.role = req.body.role;
      await user.save();
      const users = await UserModal.find();
      res.status(200).json({
        success: true,
        message: "Role Updated Successfully",
        users,
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  },

  // -------  find client information from the ticket api
  ClientDetails: async (req, res, next) => {
    const url =
      "https://api.sandbox.ticketevolution.com/v9/clients/" + req.params.id;
    tevoClient
      .getJSON(url)
      .then((json) => {
        return res.send(json);
      })
      .catch((err) => {
        return res.send("error: " + err);
      });
  },

  // --- forgot password
  ForgotPasswordSendOTP: async (req, res, next) => {
    try {
      const { email } = req.body;
      if (!email) {
        return next(new ErrorHandler("Please enter email address", 400));
      }
      const User = await UserModal.findOne({ email: email });
      // ---- check is email exist or not
      const IsEmail = await UserModal.findOne({ email: email });
      if (!IsEmail) {
        return next(new ErrorHandler("Email not exist , try again", 400));
      }
      const OTP = Math.floor(1000 + Math.random() * 9000);
      const message = `Hello ${User?.firstName}, Your ForgotPassword OTP is ${OTP}`;
      try {
        await SendEmail({
          email,
          subject: "InstaPass, ForgotPassword OTP",
          message,
        });
        User.OTP = OTP;
        await User.save();
        res.status(200).json({
          success: true,
          message: "OTP send to email successfully",
        });
      } catch (error) {
        next(new ErrorHandler(error.message, 400));
      }
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  },

  // ---- verify opt an change password
  ResetPassword: async (req, res, next) => {
    try {
      const { OTP, NewPassword } = req.body;
      if (!OTP) {
        return next(new ErrorHandler("Please Enter OTP", 400));
      }
      if (!NewPassword) {
        return next(new ErrorHandler("Please Enter NewPassword", 400));
      }

      // --- check is otp is match or not
      const IsUser = await UserModal.findOne({ OTP: OTP });
      if (!IsUser) {
        return next(new ErrorHandler("Invalid or Expired OTP", 400));
      }
      IsUser.password = NewPassword;
      IsUser.OTP = null;
      await IsUser?.save();
      res.status(200).json({
        success: true,
        message: "Password update successfully",
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  },
};
