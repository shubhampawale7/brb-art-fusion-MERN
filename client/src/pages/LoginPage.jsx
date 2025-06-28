import { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";

const LoginPage = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { state, dispatch } = useContext(AuthContext);
  const { userInfo } = state;

  // Check for redirect query param
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
    setLoading(true);
    try {
      const { data } = await API.post("/users/login", { email, password });
      dispatch({ type: "USER_LOGIN", payload: data });
      toast.success("Login successful!");
      navigate(redirect);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign In - BRB Art Fusion</title>
      </Helmet>
      <div className="container mx-auto px-6 py-12 max-w-md">
        <motion.div
          className="bg-white p-8 rounded-lg shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-6 text-center">Sign In</h1>
          <form onSubmit={submitHandler} className="space-y-4">
            {/* ... (Form fields for email and password as in ShippingPage) ... */}
            <div>
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#BFA181] focus:border-[#BFA181]"
              />
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#BFA181] focus:border-[#BFA181]"
              />
            </div>
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#333333] text-white py-3 rounded-md hover:bg-black transition disabled:bg-gray-400"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </div>
          </form>
          <div className="mt-4 text-center">
            New Customer?{" "}
            <Link
              to={`/register?redirect=${redirect}`}
              className="text-[#BFA181] hover:underline"
            >
              Register
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;
