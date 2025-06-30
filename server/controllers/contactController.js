import asyncHandler from "express-async-handler";
import sendEmail from "../utils/sendEmail.js";
import "dotenv/config";

// @desc    Submit contact form and send email
// @route   POST /api/contact
// @access  Public
const submitContactForm = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Simple validation
  if (!name || !email || !subject || !message) {
    res.status(400);
    throw new Error("Please fill out all fields.");
  }

  const emailMessage = `
        You have received a new message from your website's contact form:
        --------------------------------------------------
        Name: ${name}
        Email: ${email}
        Subject: ${subject}
        --------------------------------------------------
        Message:
        ${message}
    `;

  await sendEmail({
    email: process.env.YOUR_BUSINESS_EMAIL, // The destination email
    subject: `Contact Form: ${subject}`,
    message: emailMessage,
  });

  res
    .status(200)
    .json({ success: true, message: "Message sent successfully!" });
});

export { submitContactForm };
