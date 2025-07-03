import { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "sonner";
import { FaEdit, FaTrash, FaPlus, FaBoxOpen, FaSort } from "react-icons/fa"; // Added FaBoxOpen and FaSort
import { ClipLoader } from "react-spinners";
import { Helmet } from "react-helmet-async";
import ReactPaginate from "react-paginate";

const ProductListPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ products: [], page: 1, pages: 1 });
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("latest");
  const {
    state: { userInfo },
  } = useContext(AuthContext);

  // Function to fetch products (moved inside component for better scope access)
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data: responseData } = await API.get("/products", {
        params: { pageNumber, sort: sortOption },
        headers: { Authorization: `Bearer ${userInfo.token}` }, // Added auth header
      });
      setData(responseData);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch products");
      // Optional: Redirect to login if unauthorized
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      fetchProducts();
    } else {
      // If not admin, redirect or show unauthorized message
      toast.error("You are not authorized to view this page.");
      navigate("/"); // Redirect to home or a suitable unauthorized page
    }
  }, [userInfo, pageNumber, sortOption, navigate]); // Added navigate to dependency array

  const handlePageClick = (event) => {
    setPageNumber(event.selected + 1);
    // Smooth scroll to the top of the table for better UX on pagination
    const tableTop = document.getElementById("products-table-container");
    if (tableTop) {
      tableTop.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo(0, 0);
    }
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setPageNumber(1); // Reset to first page on sort change
  };

  const createProductHandler = async () => {
    if (window.confirm("A new sample product will be created. Are you sure?")) {
      try {
        // Show loader for creation action
        setLoading(true);
        const { data } = await API.post(
          "/products",
          {},
          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        toast.success(
          "Product created successfully! Redirecting to edit page..."
        );
        navigate(`/admin/product/${data._id}/edit`);
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Product creation failed."
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const deleteHandler = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this product? This action cannot be undone."
      )
    ) {
      try {
        // Show loading state, perhaps on the table itself or a global one
        setLoading(true);
        await API.delete(`/products/${id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success("Product deleted successfully!");
        // Refetch the current page after deletion to update the list
        fetchProducts();
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Product deletion failed."
        );
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin: Product List - BRB Art Fusion</title>
      </Helmet>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight flex items-center">
            <FaBoxOpen className="mr-4 text-brb-primary text-4xl md:text-5xl" />
            Product Catalog
          </h1>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mt-4 sm:mt-0">
            <div className="relative w-full sm:w-auto">
              <select
                onChange={handleSortChange}
                value={sortOption}
                className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-brb-primary focus:border-brb-primary transition-all duration-200 shadow-sm"
              >
                <option value="latest">Sort by Latest</option>
                <option value="name_asc">Name (A-Z)</option>
                <option value="name_desc">Name (Z-A)</option>
                <option value="price_asc">Price (Low to High)</option>
                <option value="price_desc">Price (High to Low)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <FaSort className="text-sm" />
              </div>
            </div>
            <button
              onClick={createProductHandler}
              className="w-full sm:w-auto bg-brb-primary text-white px-6 py-3 rounded-lg flex items-center justify-center hover:bg-brb-primary-dark transition-all duration-200 font-semibold text-lg shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={loading} // Disable if overall loading
            >
              <FaPlus className="mr-2" /> New Product
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <ClipLoader color="#BFA181" size={70} />
          </div>
        ) : (
          <>
            {data.products.length === 0 ? (
              <div className="text-center py-10 text-gray-600 text-xl font-medium">
                No products found. Try creating one!
              </div>
            ) : (
              <div
                id="products-table-container"
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
                          Price
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                        >
                          Category
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {data.products.map((product) => (
                        <tr
                          key={product._id}
                          className="hover:bg-gray-50 transition-colors duration-200 ease-in-out"
                        >
                          <td
                            className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600 truncate max-w-[120px] md:max-w-[200px]"
                            title={product._id}
                          >
                            {product._id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-base font-semibold text-gray-900">
                            {product.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">
                            ₹{product.price.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">
                            {product.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right flex items-center justify-end space-x-2">
                            <Link
                              to={`/admin/product/${product._id}/edit`}
                              className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-700 transition-colors duration-200"
                              aria-label={`Edit product ${product.name}`}
                              title={`Edit ${product.name}`}
                            >
                              <FaEdit size={16} />
                            </Link>
                            <button
                              onClick={() => deleteHandler(product._id)}
                              className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 transition-colors duration-200 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                              aria-label={`Delete product ${product.name}`}
                              title={`Delete ${product.name}`}
                              disabled={loading} // Disable delete during overall loading
                            >
                              <FaTrash size={14} />
                            </button>
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

export default ProductListPage;
