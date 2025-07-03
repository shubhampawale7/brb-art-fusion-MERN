import { useEffect, useState, useContext } from "react";
import API from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "sonner";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaTrash,
  FaUserShield,
  FaRegUser,
} from "react-icons/fa"; // Added icons
import { ClipLoader } from "react-spinners";
import { Helmet } from "react-helmet-async";

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const {
    state: { userInfo },
  } = useContext(AuthContext);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/users", {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setUsers(data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [userInfo.token]);

  const deleteHandler = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      try {
        await API.delete(`/users/${id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success("User deleted successfully!");
        fetchUsers(); // Refetch users to update the list
      } catch (error) {
        toast.error(error?.response?.data?.message || "User deletion failed.");
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin: User List - BRB Art Fusion</title>
      </Helmet>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
          <FaRegUser className="inline-block mr-3 text-brb-primary" />
          User Management
        </h1>
        <p className="text-center text-lg text-gray-600 mb-10">
          View and manage all registered users on BRB Art Fusion.
        </p>

        {loading ? (
          <div className="flex justify-center py-20">
            <ClipLoader color="#BFA181" size={70} />
          </div>
        ) : (
          <>
            {users.length === 0 ? (
              <div className="text-center py-10 text-gray-600 text-xl">
                No users found.
              </div>
            ) : (
              <div className="bg-white shadow-xl rounded-lg overflow-hidden ring-1 ring-gray-100">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                        >
                          ID
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                        >
                          Email
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider"
                        >
                          Admin
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {users.map((user) => (
                        <tr
                          key={user._id}
                          className="hover:bg-gray-50 transition-colors duration-200 ease-in-out"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                            {user._id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-base font-semibold text-gray-900">
                            {user.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <a
                              href={`mailto:${user.email}`}
                              className="text-blue-600 hover:text-blue-800 transition-colors duration-200 ease-in-out font-medium"
                            >
                              {user.email}
                            </a>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                            {user.isAdmin ? (
                              <FaUserShield
                                className="text-green-500 text-lg mx-auto"
                                title="Administrator"
                              />
                            ) : (
                              <FaTimesCircle
                                className="text-red-400 text-lg mx-auto"
                                title="Not Administrator"
                              />
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                            <button
                              onClick={() => deleteHandler(user._id)}
                              className={`p-2 rounded-full transition-all duration-200 ease-in-out ${
                                user.isAdmin
                                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                  : "bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                              }`}
                              disabled={user.isAdmin}
                              aria-label={`Delete user ${user.name}`}
                              title={
                                user.isAdmin
                                  ? "Cannot delete admin users"
                                  : `Delete ${user.name}`
                              }
                            >
                              <FaTrash className="text-base" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default UserListPage;
