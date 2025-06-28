import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { toast } from "sonner";
import API from "../services/api";
import { ClipLoader } from "react-spinners";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/users/forgotpassword", { email });
      // For security, we always show a success message to prevent users
      // from checking which emails are registered with the service.
      toast.info(
        "If an account with that email exists, a password reset link has been sent."
      );
    } catch (err) {
      // We still show a success message even on server error for security.
      toast.info(
        "If an account with that email exists, a password reset link has been sent."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Forgot Password - BRB Art Fusion</title>
      </Helmet>
      <div className="container mx-auto px-6 py-12 max-w-md">
        <motion.div
          className="bg-white p-8 rounded-lg shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-2 text-center">
            Forgot Password
          </h1>
          <p className="text-center text-gray-600 mb-6">
            Enter your email and we'll send you a link to reset your password.
          </p>
          <form onSubmit={submitHandler} className="space-y-4">
            <div>
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#BFA181] focus:border-[#BFA181]"
              />
            </div>
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#333333] text-white py-3 rounded-md hover:bg-black transition disabled:bg-gray-400 flex justify-center items-center"
              >
                {loading ? (
                  <ClipLoader size={20} color="#fff" />
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </div>
          </form>
          <div className="mt-4 text-center">
            <Link
              to="/login"
              className="text-sm text-[#BFA181] hover:underline"
            >
              &larr; Back to Login
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;
