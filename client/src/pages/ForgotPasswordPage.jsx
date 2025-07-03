import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { toast } from "sonner";
import API from "../services/api";
import { ClipLoader } from "react-spinners";
import { FiMail, FiSend, FiArrowLeft } from "react-icons/fi"; // Feather Icons

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/users/forgotpassword", { email });
      // For security, always show a success message to prevent user enumeration.
      toast.info(
        "If an account with that email exists, a password reset link has been sent to your inbox. Please check your spam folder as well."
      );
    } catch (err) {
      // Still show a success message even on server error for security.
      toast.info(
        "If an account with that email exists, a password reset link has been sent to your inbox. Please check your spam folder as well."
      );
    } finally {
      setLoading(false);
      setEmail(""); // Clear email field after submission attempt
    }
  };

  const inputClass =
    "w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brb-primary focus:border-brb-primary outline-none transition text-gray-800";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <>
      <Helmet>
        <title>Forgot Password - BRB Art Fusion</title>
      </Helmet>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        {" "}
        {/* Full page height, centered content */}
        <motion.div
          className="max-w-md w-full bg-white p-8 sm:p-10 rounded-xl shadow-2xl border border-gray-100" /* Stronger shadow, softer corners, border */
          initial={{ opacity: 0, y: 50 }} // Animate from slightly below
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }} // Smooth entry animation
        >
          <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center tracking-tight leading-tight">
            {" "}
            {/* Larger, bolder heading */}
            Forgot Password?
          </h1>
          <p className="text-gray-600 text-center mb-8 text-lg">
            Enter your email address below and we'll send you a link to reset
            your password.
          </p>
          <form onSubmit={submitHandler} className="space-y-6">
            {" "}
            {/* Increased spacing */}
            {/* Email Address */}
            <div>
              <label htmlFor="email" className={labelClass}>
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={inputClass}
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brb-primary text-white py-3 rounded-lg hover:bg-brb-primary-dark transition-colors font-semibold text-lg flex items-center justify-center shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <ClipLoader size={24} color="white" />
                ) : (
                  <>
                    <FiSend className="mr-2" /> Send Reset Link
                  </>
                )}
              </button>
            </div>
          </form>
          {/* Back to Login Link */}
          <div className="mt-8 text-center text-base text-gray-700">
            {" "}
            {/* Increased margin */}
            Remembered your password?{" "}
            <Link
              to="/login"
              className="text-brb-primary hover:text-brb-primary-dark font-semibold transition-colors flex items-center justify-center mt-3" /* Highlighted link, center aligned, new icon */
            >
              <FiArrowLeft className="mr-2" /> Back to Login
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;
