import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ClipLoader } from "react-spinners";

const ProductEditPage = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const {
    state: { userInfo },
  } = useContext(AuthContext);

  // State for form fields
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [images, setImages] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");

  // State for loading indicators
  const [loading, setLoading] = useState(true);
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${productId}`);
        // Populate form fields with fetched data
        setName(data.name);
        setPrice(data.price);
        setImages(data.images.join(", ")); // Convert image array to a comma-separated string for the textarea
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setDescription(data.description);
      } catch (error) {
        toast.error("Could not fetch product details.");
        navigate("/admin/productlist");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoadingUpdate(true);
    try {
      const productData = {
        name,
        price: Number(price),
        description,
        images: images
          .split(",")
          .map((img) => img.trim())
          .filter((img) => img), // Split string back into an array, trim whitespace, and remove empty strings
        category,
        countInStock: Number(countInStock),
      };

      await API.put(`/products/${productId}`, productData, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });

      toast.success("Product updated successfully!");
      navigate("/admin/productlist");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update product."
      );
    } finally {
      setLoadingUpdate(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#BFA181" size={50} />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Edit Product - BRB Art Fusion</title>
      </Helmet>
      <div className="container mx-auto px-6 py-8 max-w-lg">
        <Link
          to="/admin/productlist"
          className="text-[#BFA181] hover:underline mb-4 inline-block"
        >
          &larr; Go Back to Product List
        </Link>
        <motion.div
          className="bg-white p-8 rounded-lg shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-6 text-center">Edit Product</h1>
          <form onSubmit={submitHandler} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
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
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Price
              </label>
              <input
                id="price"
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#BFA181] focus:border-[#BFA181]"
              />
            </div>
            <div>
              <label
                htmlFor="images"
                className="block text-sm font-medium text-gray-700"
              >
                Image URLs (comma-separated)
              </label>
              <textarea
                id="images"
                rows="3"
                value={images}
                onChange={(e) => setImages(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#BFA181] focus:border-[#BFA181]"
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">
                For multiple images, separate URLs with a comma.
              </p>
            </div>
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                Category
              </label>
              <input
                id="category"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#BFA181] focus:border-[#BFA181]"
              />
            </div>
            <div>
              <label
                htmlFor="countInStock"
                className="block text-sm font-medium text-gray-700"
              >
                Count In Stock
              </label>
              <input
                id="countInStock"
                type="number"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#BFA181] focus:border-[#BFA181]"
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                rows="5"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#BFA181] focus:border-[#BFA181]"
              ></textarea>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loadingUpdate}
                className="w-full bg-[#333333] text-white py-3 rounded-md hover:bg-black transition disabled:bg-gray-400 flex justify-center items-center"
              >
                {loadingUpdate ? (
                  <ClipLoader size={20} color="#fff" />
                ) : (
                  "Update Product"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
};

export default ProductEditPage;
