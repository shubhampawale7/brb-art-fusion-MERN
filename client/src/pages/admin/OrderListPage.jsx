import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "sonner";
import { FaCheckCircle, FaTimesCircle, FaClipboardList } from "react-icons/fa"; // Added FaClipboardList
import { ClipLoader } from "react-spinners";
import { Helmet } from "react-helmet-async";
import ReactPaginate from "react-paginate";

const OrderListPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ orders: [], page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const {
    state: { userInfo },
  } = useContext(AuthContext);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const { data: responseData } = await API.get("/orders", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
          params: { pageNumber },
        });
        setData(responseData);
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userInfo.token, pageNumber]);

  const handlePageClick = (event) => {
    setPageNumber(event.selected + 1);
    // Smooth scroll to the top of the table for better UX on pagination
    const tableTop = document.getElementById("orders-table-container");
    if (tableTop) {
      tableTop.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo(0, 0);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin: All Orders - BRB Art Fusion</title>
      </Helmet>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8 tracking-tight leading-tight text-center">
          <FaClipboardList className="inline-block mr-4 text-brb-primary text-4xl md:text-5xl" />
          All Customer Orders
        </h1>
        <p className="text-center text-lg text-gray-600 mb-10">
          Effortlessly manage and track all orders placed by your customers.
        </p>

        {loading ? (
          <div className="flex justify-center py-20">
            <ClipLoader color="#BFA181" size={70} />
          </div>
        ) : (
          <>
            {data.orders.length === 0 ? (
              <div className="text-center py-10 text-gray-600 text-xl font-medium">
                No orders found.
              </div>
            ) : (
              <div
                id="orders-table-container"
                className="bg-white shadow-xl rounded-lg overflow-hidden ring-1 ring-gray-100"
              >
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                        >
                          Order ID
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                        >
                          Customer
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                        >
                          Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                        >
                          Total
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider"
                        >
                          Paid Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider"
                        >
                          Delivery Status
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
                      {data.orders.map((order) => (
                        <tr
                          key={order._id}
                          className="hover:bg-gray-50 transition-colors duration-200 ease-in-out"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                            {order._id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-base font-semibold text-gray-900">
                            {order.user?.name || "Guest User"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-base font-semibold text-gray-900">
                            ₹{order.totalPrice.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                            {order.isPaid ? (
                              <FaCheckCircle
                                className="text-green-500 text-lg mx-auto"
                                title={`Paid on ${new Date(
                                  order.paidAt
                                ).toLocaleDateString()}`}
                              />
                            ) : (
                              <FaTimesCircle
                                className="text-red-400 text-lg mx-auto"
                                title="Not Paid"
                              />
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                            {order.isDelivered ? (
                              <FaCheckCircle
                                className="text-green-500 text-lg mx-auto"
                                title={`Delivered on ${new Date(
                                  order.deliveredAt
                                ).toLocaleDateString()}`}
                              />
                            ) : (
                              <FaTimesCircle
                                className="text-red-400 text-lg mx-auto"
                                title="Not Delivered"
                              />
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                            <Link
                              to={`/admin/order/${order._id}`}
                              className="px-4 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 hover:text-blue-700 transition-colors duration-200 font-medium text-sm"
                            >
                              View Details
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Pagination Component */}
            {data.pages > 1 && (
              <div className="mt-10 flex justify-center">
                <ReactPaginate
                  nextLabel="Next >"
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={3}
                  marginPagesDisplayed={2}
                  pageCount={data.pages}
                  forcePage={data.page - 1} // `data.page` is 1-indexed, `forcePage` is 0-indexed
                  previousLabel="< Previous"
                  containerClassName="pagination flex items-center space-x-2"
                  pageLinkClassName="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  previousLinkClassName="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  nextLinkClassName="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  breakLinkClassName="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
                  activeLinkClassName="!bg-brb-primary !text-white !border-brb-primary hover:!bg-brb-primary-dark"
                  disabledClassName="opacity-50 cursor-not-allowed"
                  renderOnZeroPageCount={null}
                />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default OrderListPage;
