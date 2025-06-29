import { useState, useEffect, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const { state: auth, dispatch: authDispatch } = useContext(AuthContext);
  const { userInfo } = auth;

  // State for the form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  // State for order history
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    // Pre-fill form with current user info
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }

    const fetchOrders = async () => {
      try {
        const { data } = await API.get("/orders/myorders", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setOrders(data);
      } catch (error) {
        toast.error("Could not fetch orders.");
      } finally {
        setLoadingOrders(false);
      }
    };

    if (userInfo) {
      fetchOrders();
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoadingUpdate(true);
    try {
      const { data } = await API.put(
        "/users/profile",
        { name, email, password },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      // Dispatch login with new data to update context and localStorage
      authDispatch({ type: "USER_LOGIN", payload: data });
      toast.success("Profile updated successfully!");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update profile."
      );
    } finally {
      setLoadingUpdate(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>My Profile - BRB Art Fusion</title>
      </Helmet>
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8">My Profile</h1>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Update Profile Form */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">Update Details</h2>
              <form onSubmit={submitHandler} className="space-y-4">
                <div>
                  <label className="font-semibold">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full mt-1 p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="font-semibold">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full mt-1 p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="font-semibold">New Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Leave blank to keep the same"
                    className="w-full mt-1 p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="font-semibold">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Leave blank to keep the same"
                    className="w-full mt-1 p-2 border rounded-md"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loadingUpdate}
                  className="w-full bg-brand-accent text-white py-2 rounded-md hover:bg-opacity-90 transition font-semibold flex justify-center"
                >
                  {loadingUpdate ? (
                    <ClipLoader size={20} color="white" />
                  ) : (
                    "Update Profile"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Order History Column */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">My Orders</h2>
            {loadingOrders ? (
              <div className="flex justify-center py-10">
                <ClipLoader color="#BFA181" size={50} />
              </div>
            ) : (
              <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                {/* ... Order history table JSX remains the same ... */}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
