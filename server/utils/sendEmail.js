import nodemailer from "nodemailer";
import "dotenv/config";

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const message = {
    from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`, // e.g., "BRB Art Fusion" <noreply@brbartfusion.com>
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html: options.html for rich text emails
  };

  const info = await transporter.sendMail(message);

  console.log("Message sent: %s", info.messageId);
};

export default sendEmail;
