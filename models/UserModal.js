const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please Enter Your First Name"],
    },
    lastName: {
      type: String,
      required: [true, "Please Enter Your Last Name"],
    },
    phoneNumber: {
      type: String,
      // required: [true, "Please Enter Your Phone Number"],
    },
    email: {
      type: String,
      required: [true, "Please Enter Your Email"],
      unique: true,
      validate: [validator.isEmail, "Please Enter Valid Email"],
    },
    password: {
      type: String,
      required: [true, "Please Enter Your Password"],
    },
    Avatar: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
    },
    clientId: {
      type: String,
      // required: [true, "Plaese Enter The Client ID"],
    },
    emailAddressId: {
      type: String,
      // required: [true, "Plaese Enter The Client ID"],
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    OTP: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

// ---- hash user password

UserSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hashSync(this.password, 10);
  }
});

const UserModal = mongoose.model("User", UserSchema);
module.exports = UserModal;
