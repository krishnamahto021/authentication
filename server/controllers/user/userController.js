const { resetPasswordEmail } = require("../../mailers/resetPassword");
const { verifyUserEmail } = require("../../mailers/verifyUserEmail");
const User = require("../../models/userModel");
const passwordHelper = require("../../utils/passwordHelper");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
function isEmail(identifier) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(identifier);
}

module.exports.signUp = async function (req, res) {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both identifier and password",
      });
    }

    let user;
    if (isEmail(identifier)) {
      user = await User.findOne({ email: identifier });
    } else {
      user = await User.findOne({ username: identifier });
    }

    if (user) {
      // done intentionally so that users without email can also
      // if (!user.isVerified) {
      //   return res.status(400).send({
      //     success: true,
      //     message: "You are not verified!",
      //   });
      // }
      const jwtToken = await jwt.sign(
        user.toJSON(),
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "30d",
        }
      );
      const matchPassword = await passwordHelper.compareHashedPasswordFunction(
        password,
        user.password
      );
      if (!matchPassword) {
        return res.status(401).json({
          success: false,
          message: "Invalid password",
        });
      }
      return res.status(200).json({
        success: true,
        message: "User sign in successful",
        user: {
          jwtToken,
        },
      });
    } else {
      const hashedPassword = await passwordHelper.hashingPasswordFunction(
        password
      );

      const newUser = await User.create({
        [isEmail(identifier) ? "email" : "username"]: identifier,
        password: hashedPassword,
        token: crypto.randomBytes(16).toString("hex"),
      });
      if (newUser.email) {
        verifyUserEmail(newUser);
      }
      return res.status(201).json({
        firstTime: true,
        success: true,
        message: "Verify your email ",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports.verifyUser = async function (req, res) {
  try {
    const { token } = req.params;
    const user = await User.findOne({ token });
    if (user) {
      user.isVerified = true;
      user.token = crypto.randomBytes(16).toString("hex");
      await user.save();
      return res.status(200).send({
        success: true,
        message: "Email verified !",
      });
    }
    return res.status(400).send({
      success: false,
      message: "Token is not valid",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal server error !",
    });
  }
};

module.exports.sendMailForResetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      if (user.isVerified) {
        //send mail
        resetPasswordEmail(user);
        return res.status(200).send({
          success: true,
          message: "Check your mail",
        });
      } else {
        return res.status(400).send({
          success: false,
          message: "Please verify your email to continue",
        });
      }
    } else {
      return res.status(400).send({
        success: false,
        message: "Email not registered",
      });
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal server Error",
    });
  }
};

module.exports.updatePassword = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).send({
        success: false,
        message: "New Password is required",
      });
    }
    const user = await User.findById(req.user._id);
    const hashedPassword = await passwordHelper.hashingPasswordFunction(
      password
    );
    user.password = hashedPassword;
    await user.save();
    return res.status(200).send({
      success: true,
      message: "Password Updated succesfully",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports.sendApiKeys = async (req, res) => {
  try {
    const apiKey = process.env.API_KEY;
    return res.status(200).send({
      success: true,
      apiKey,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal server errror",
    });
  }
};
