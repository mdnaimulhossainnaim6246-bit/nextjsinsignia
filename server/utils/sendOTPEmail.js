import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendOTPEmail = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.ADMIN_EMAIL_PASS.trim(),
    },
  });

  const mailOptions = {
    from: `"Admin Panel" <${process.env.ADMIN_EMAIL}>`,
    to,
    subject: "INSIGNIA TOUR & TRAVEL",
    html: `
      <div style="font-family: "poppins", sans-serif; padding: 20px;"> 
        <h2> Admin Login OTP</h2>
        <p>Your One-Time Password (OTP) is:</p>
        <h1 style="color: #007bff;">${otp}</h1>
        <p>This OTP will expire in 5 minutes.</p>
        <br/>
        <p style="font-size: 13px; color: #888;">If you didn't request this, please ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

