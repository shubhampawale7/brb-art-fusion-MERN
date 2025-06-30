import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "sonner";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
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
    window.scrollTo(0, 0);
  };

  return (
    <>
      <Helmet>
        <title>Admin: All Orders - BRB Art Fusion</title>
      </Helmet>
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-bold text-text-primary mb-6">
          All Orders
        </h1>
        {loading ? (
          <div className="flex justify-center py-10">
            <ClipLoader color="#BFA181" size={50} />
          </div>
        ) : (
          <>
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-page-bg">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-primary uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-primary uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-primary uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-primary uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-text-primary uppercase tracking-wider">
                      Paid
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-text-primary uppercase tracking-wider">
                      Delivered
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-text-primary uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.orders.map((order) => (
                    <tr key={order._id} className="hover:bg-page-bg">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary font-mono">
                        {order._id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-text-primary">
                        {order.user?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                        ₹{order.totalPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        {order.isPaid ? (
                          <FaCheckCircle className="text-green-500 mx-auto" />
                        ) : (
                          <FaTimesCircle className="text-red-500 mx-auto" />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        {order.isDelivered ? (
                          <FaCheckCircle className="text-green-500 mx-auto" />
                        ) : (
                          <FaTimesCircle className="text-red-500 mx-auto" />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        {/* CORRECTED: This link now points to the admin order detail page */}
                        <Link
                          to={`/admin/order/${order._id}`}
                          className="text-brand-accent hover:underline font-semibold"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Component */}
            {data.pages > 1 && (
              <div className="mt-8">
                <ReactPaginate
                  nextLabel="Next >"
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={3}
                  marginPagesDisplayed={2}
                  pageCount={data.pages}
                  forcePage={data.page - 1}
                  previousLabel="< Prev"
                  pageClassName="page-item"
                  pageLinkClassName="page-link"
                  previousClassName="page-item"
                  previousLinkClassName="page-link"
                  nextClassName="page-item"
                  nextLinkClassName="page-link"
                  breakLabel="..."
                  breakClassName="page-item"
                  breakLinkClassName="page-link"
                  containerClassName="pagination"
                  activeClassName="active"
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
