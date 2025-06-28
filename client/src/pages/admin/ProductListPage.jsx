import { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "sonner";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { Helmet } from "react-helmet-async";

const ProductListPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const {
    state: { userInfo },
  } = useContext(AuthContext);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // The backend now sends an object { products, page, pages }
      const { data } = await API.get("/products");
      // We need to set our state with the array inside that object
      setProducts(data.products);
    } catch (error) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      fetchProducts();
    }
  }, [userInfo]);

  const createProductHandler = async () => {
    if (window.confirm("A new sample product will be created. Are you sure?")) {
      try {
        const { data } = await API.post(
          "/products",
          {},
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Products
          </h1>
          <button
            onClick={createProductHandler}
            className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded-md flex items-center justify-center hover:bg-green-700 transition"
          >
            <FaPlus className="mr-2" /> Create Product
          </button>
        </div>
        {loading ? (
          <div className="flex justify-center py-10">
            <ClipLoader color="#BFA181" size={50} />
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products &&
                    products.map(
                      (
                        product // Added a check for products to be safe
                      ) => (
                        <tr key={product._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product._id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            {product.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            ₹{product.price.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {product.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                            <Link
                              to={`/admin/product/${product._id}/edit`}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                              aria-label="Edit"
                            >
                              <FaEdit size={18} />
                            </Link>
                            <button
                              onClick={() => deleteHandler(product._id)}
                              className="text-red-600 hover:text-red-900"
                              aria-label="Delete"
                            >
                              <FaTrash size={16} />
                            </button>
                          </td>
                        </tr>
                      )
                    )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductListPage;
