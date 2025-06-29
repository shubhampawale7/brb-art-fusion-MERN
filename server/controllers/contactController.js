import sendEmail from "../utils/sendEmail.js";
import "dotenv/config";

// @desc    Submit contact form and send email
// @route   POST /api/contact
// @access  Public
const submitContactForm = async (req, res) => {
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

  try {
    await sendEmail({
      email: process.env.YOUR_BUSINESS_EMAIL, // The destination email
      subject: `New Contact Form Submission: ${subject}`,
      message: emailMessage,
    });

    res
      .status(200)
      .json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500);
    throw new Error("Email could not be sent. Please try again later.");
  }
};

export { submitContactForm };
