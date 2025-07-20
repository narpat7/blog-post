import nodemailer from "nodemailer";
import twilio from "twilio";

export const sendOtp = async ({ email, phone, otp }) => {
  if (email) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
  } else if (phone) {
    const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
    await client.messages.create({
      body: `Your OTP is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });
  }
};
