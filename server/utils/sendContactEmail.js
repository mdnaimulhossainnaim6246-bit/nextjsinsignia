import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASS.trim(),
  },
});
// const transporter2 = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.ADMIN_EMAIL2,
//     pass: process.env.ADMIN_EMAIL_PASS2.trim(),
//   },
// });

export const sendContactEmail = async (contactData) => {
  const { fullName, email, age, gender, country, phone, message, profileImage } = contactData;

  const mailOptions = {
    from: `"Insignia Tour & Travel" <${process.env.ADMIN_EMAIL}>`,
    // to: process.env.ADMIN_EMAIL,
    to: `${process.env.ADMIN_EMAIL}, ${process.env.ADMIN_EMAIL2}`,
    replyTo: email,
    subject: `New Contact Form Submission from ${fullName}`,
    html: `
      <div style="font-family: 'poppins', sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
        <h2 style="color: #007bff;">New Message from Contact Form</h2>
        <p><strong>Gender:</strong> ${gender}</p>
        <p><strong>Full Name:</strong> ${fullName}</p>
        <p><strong>Age:</strong> ${age}</p>
        <p><strong>Country:</strong> ${country.name}</p>
        <p><strong>Phone Number:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <hr>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      </div>
    `,
    attachments: [],
  };

  if (profileImage) {
    mailOptions.attachments.push({
      filename: profileImage.originalname,
      content: profileImage.buffer,
      contentType: profileImage.mimetype,
    });
  }

  await transporter.sendMail(mailOptions);
  // await transporter2.sendMail(mailOptions);
};
