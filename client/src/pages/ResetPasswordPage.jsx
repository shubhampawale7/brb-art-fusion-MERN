import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { toast } from "sonner";
import API from "../services/api";
import { ClipLoader } from "react-spinners";
import { FiLock, FiRefreshCw } from "react-icons/fi"; // Feather Icons

const ResetPasswordPage = () => {
  const { resettoken } = useParams(); // Token from URL parameters
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    // Optional: Add client-side password strength validation (e.g., minimum length)
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      await API.put(`/users/resetpassword/${resettoken}`, { password });
      toast.success(
        "Password has been reset successfully! You can now log in with your new password."
      );
      navigate("/login"); // Redirect to login page after successful reset
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to reset password. The link may be invalid or expired. Please request a new one."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brb-primary focus:border-brb-primary outline-none transition text-gray-800";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <>
      <Helmet>
        <title>Reset Password - BRB Art Fusion</title>
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
            Set New Password
          </h1>
          <p className="text-gray-600 text-center mb-8 text-lg">
            Enter your new password below.
          </p>
          <form onSubmit={submitHandler} className="space-y-6">
            {" "}
            {/* Increased spacing */}
            {/* New Password */}
            <div>
              <label htmlFor="password" className={labelClass}>
                New Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
            </div>
            {/* Confirm New Password */}
            <div>
              <label htmlFor="confirmPassword" className={labelClass}>
                Confirm New Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={inputClass}
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
                    <FiRefreshCw className="mr-2" /> Reset Password
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
};

export default ResetPasswordPage;
