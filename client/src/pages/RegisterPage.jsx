import { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners"; // For loading spinner
import { FiUser, FiMail, FiLock, FiUserPlus, FiLogIn } from "react-icons/fi"; // Feather Icons

import { AuthContext } from "../context/AuthContext";
import API from "../services/api";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { search } = useLocation();

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Get auth context
  const { state, dispatch } = useContext(AuthContext);
  const { userInfo } = state;

  // Check for redirect query param from the URL
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    // If user is already logged in, redirect them
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await API.post("/users/register", {
        name,
        email,
        password,
      });

      // Dispatch login action to automatically sign in the new user
      dispatch({ type: "USER_LOGIN", payload: data });

      toast.success(`Welcome, ${data.name}! Registration successful.`);
      navigate(redirect);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Registration failed. Please try again."
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
        <title>Sign Up - BRB Art Fusion</title>
      </Helmet>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-md w-full bg-white p-8 sm:p-10 rounded-xl shadow-2xl border border-gray-100"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center tracking-tight leading-tight">
            Create Your Account
          </h1>
          <p className="text-gray-600 text-center mb-8 text-lg">
            Join BRB Art Fusion and discover unique pieces.
          </p>
          <form onSubmit={submitHandler} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className={labelClass}>
                Your Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
            </div>
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
                />
              </div>
            </div>
            {/* Password */}
            <div>
              <label htmlFor="password" className={labelClass}>
                Password
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
            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className={labelClass}>
                Confirm Password
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
                    <FiUserPlus className="mr-2" /> Register
                  </>
                )}
              </button>
            </div>
          </form>
          {/* Sign In Link */}
          <div className="mt-8 text-center text-base text-gray-700">
            Already have an account?{" "}
            <Link
              to={`/login?redirect=${redirect}`}
              className="text-brb-primary hover:text-brb-primary-dark font-semibold transition-colors flex items-center justify-center mt-3"
            >
              <FiLogIn className="mr-2" /> Sign In
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default RegisterPage;
