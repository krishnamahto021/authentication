const nodemailer = require("../config/nodemailer");

const ejs = require("ejs");
const path = require("path");
const dotenv = require("dotenv").config();
module.exports.verifyUserEmail = async (user) => {
  try {
    let emailHtml = await ejs.renderFile(
      path.join(__dirname, "../views/verifyUserEmail.ejs"),
      { token: user.token }
    );
    const options = {
      from: process.env.EMAIL,
      to: user.email,
      subject: `Verify your email to continue `,
      html: emailHtml,
    };
    await nodemailer.transporter.sendMail(options);
  } catch (error) {
    console.log(`error in sending verification mail ${error}`);
  }
};
