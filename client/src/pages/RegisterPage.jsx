import { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import { ClipLoader } from "react-spinners";

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
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
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

  return (
    <>
      <Helmet>
        <title>Sign Up - BRB Art Fusion</title>
      </Helmet>
      <div className="container mx-auto px-6 py-12 max-w-md">
        <motion.div
          className="bg-white p-8 rounded-lg shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-6 text-center">
            Create Account
          </h1>
          <form onSubmit={submitHandler} className="space-y-4">
            <div>
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#BFA181] focus:border-[#BFA181]"
              />
            </div>
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
            <div>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#BFA181] focus:border-[#BFA181]"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                {loading ? <ClipLoader size={20} color="#fff" /> : "Register"}
              </button>
            </div>
          </form>
          <div className="mt-4 text-center">
            Already have an account?{" "}
            <Link
              to={`/login?redirect=${redirect}`}
              className="text-[#BFA181] hover:underline"
            >
              Sign In
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default RegisterPage;
