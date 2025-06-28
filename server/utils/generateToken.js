import jwt from "jsonwebtoken";
import "dotenv/config";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d", // The token will expire in 30 days
  });
};

export default generateToken;
