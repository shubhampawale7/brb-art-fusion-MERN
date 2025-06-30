import { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "sonner";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
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

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data: responseData } = await API.get("/products", {
          params: { pageNumber, sort: sortOption },
        });
        setData(responseData);
      } catch (error) {
        toast.error("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    if (userInfo && userInfo.isAdmin) {
      fetchProducts();
    }
  }, [userInfo, pageNumber, sortOption]);

  const handlePageClick = (event) => {
    setPageNumber(event.selected + 1);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setPageNumber(1);
  };

  const createProductHandler = async () => {
    if (window.confirm("A new sample product will be created. Are you sure?")) {
      try {
        const { data } = await API.post(
          "/products",
          {},
          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        toast.success("Product created successfully. You can now edit it.");
        navigate(`/admin/product/${data._id}/edit`);
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Product creation failed"
        );
      }
    }
  };

  const deleteHandler = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this product? This cannot be undone."
      )
    ) {
      try {
        await API.delete(`/products/${id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success("Product deleted successfully");
        // Refetch the current page after deletion
        fetchProducts();
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Product deletion failed"
        );
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin: Product List - BRB Art Fusion</title>
      </Helmet>
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-text-primary">Products</h1>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <select
              onChange={handleSortChange}
              value={sortOption}
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-accent"
            >
              <option value="latest">Sort by Latest</option>
              <option value="name_asc">Name (A-Z)</option>
              <option value="name_desc">Name (Z-A)</option>
              <option value="price_asc">Price (Low to High)</option>
              <option value="price_desc">Price (High to Low)</option>
            </select>
            <button
              onClick={createProductHandler}
              className="bg-brand-accent text-white px-4 py-2 rounded-md flex items-center justify-center hover:bg-opacity-90 transition font-semibold"
            >
              <FaPlus className="mr-2" /> Create
            </button>
          </div>
        </div>
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
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-primary uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-primary uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-text-primary uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.products.map((product) => (
                    <tr key={product._id} className="hover:bg-page-bg">
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary font-mono"
                        title={product._id}
                      >
                        {product._id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-text-primary">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                        ₹{product.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        <Link
                          to={`/admin/product/${product._id}/edit`}
                          className="text-blue-600 hover:text-blue-800 mr-4"
                          aria-label="Edit"
                        >
                          <FaEdit size={18} />
                        </Link>
                        <button
                          onClick={() => deleteHandler(product._id)}
                          className="text-red-600 hover:text-red-800"
                          aria-label="Delete"
                          disabled={product.isAdmin}
                        >
                          <FaTrash size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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

export default ProductListPage;
