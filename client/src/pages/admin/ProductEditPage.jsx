import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ClipLoader } from "react-spinners";
import {
  FaTimes,
  FaUpload,
  FaBoxes,
  FaDollarSign, // Not used but imported in original
  FaTag,
  FaPalette,
  FaWeight, // Not used but imported in original
  FaRulerCombined, // Not used but imported in original
  FaPencilAlt,
  FaChevronLeft,
} from "react-icons/fa"; // Original Fa icons

const ProductEditPage = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const {
    state: { userInfo },
  } = useContext(AuthContext);

  // State for all product fields
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [weight, setWeight] = useState("");
  const [material, setMaterial] = useState("");

  // State for loading indicators
  const [loading, setLoading] = useState(true);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false); // For media uploads

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/products/${productId}`);
        setName(data.name);
        setPrice(data.price);
        setImages(data.images || []);
        setVideos(data.videos || []);
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setDescription(data.description);
        setDimensions(data.dimensions || "");
        setWeight(data.weight || "");
        setMaterial(data.material || "");
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Could not fetch product details."
        );
        navigate("/admin/productlist"); // Redirect if product not found or error
      } finally {
        setLoading(false);
      }
    };

    if (userInfo) {
      // Ensure user is logged in before fetching
      fetchProduct();
    } else {
      navigate("/login"); // Redirect to login if not authenticated
    }
  }, [productId, navigate, userInfo]);

  const uploadFileHandler = async (e, fileType) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    // *** CRITICAL CHANGE HERE: Changed "file" to "image" to match backend Multer configuration ***
    formData.append("image", file);
    setLoadingUpload(true);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      // Assuming your upload endpoint handles both images and videos
      const { data } = await API.post("/upload", formData, config);

      if (fileType === "image")
        setImages((prevImages) => [...prevImages, data.url]);
      else if (fileType === "video")
        setVideos((prevVideos) => [...prevVideos, data.url]);

      toast.success("File uploaded successfully!");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "File upload failed. Please try again."
      );
    } finally {
      setLoadingUpload(false);
      // Clear the input value so the same file can be selected again
      e.target.value = null;
    }
  };

  const removeMedia = (urlToRemove, type) => {
    if (type === "image") {
      setImages((prevImages) =>
        prevImages.filter((image) => image !== urlToRemove)
      );
      toast.info("Image removed.");
    } else if (type === "video") {
      setVideos((prevVideos) =>
        prevVideos.filter((video) => video !== urlToRemove)
      );
      toast.info("Video removed.");
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoadingUpdate(true);
    try {
      const productData = {
        name,
        price: Number(price), // Ensure numbers are sent as numbers
        description,
        images,
        videos,
        category,
        countInStock: Number(countInStock), // Ensure numbers are sent as numbers
        dimensions,
        weight,
        material,
      };
      await API.put(`/products/${productId}`, productData, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      toast.success("Product updated successfully!");
      navigate("/admin/productlist");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to update product. Please check your inputs."
      );
    } finally {
      setLoadingUpdate(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <ClipLoader size={70} color="#BFA181" />
      </div>
    );

  const inputClass =
    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brb-primary focus:border-brb-primary outline-none transition-all duration-200 text-gray-800";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <>
      <Helmet>
        <title>Edit Product: {name} - BRB Art Fusion</title>
      </Helmet>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <Link
          to="/admin/productlist"
          className="inline-flex items-center text-brb-primary hover:text-brb-primary-dark transition-colors duration-200 mb-6 font-medium"
        >
          <FaChevronLeft className="mr-2" /> Back to Product List
        </Link>

        <motion.div
          className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 text-center flex items-center justify-center">
            <FaPencilAlt className="mr-4 text-brb-primary" /> Edit Product
            Details
          </h1>

          <form onSubmit={submitHandler} className="space-y-8">
            {/* Basic Product Information */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h2 className="md:col-span-2 text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FaTag className="mr-2 text-brb-primary" /> Product Basics
              </h2>
              <div>
                <label htmlFor="name" className={labelClass}>
                  Product Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="price" className={labelClass}>
                  Price (₹)
                </label>
                <input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  min="0" // Price cannot be negative
                  step="0.01" // Allow decimal prices
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="category" className={labelClass}>
                  Category
                </label>
                <input
                  id="category"
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="countInStock" className={labelClass}>
                  Count In Stock
                </label>
                <input
                  id="countInStock"
                  type="number"
                  value={countInStock}
                  onChange={(e) => setCountInStock(e.target.value)}
                  required
                  min="0" // Stock cannot be negative
                  className={inputClass}
                />
              </div>
            </section>

            {/* Detailed Product Specifications */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h2 className="md:col-span-2 text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FaBoxes className="mr-2 text-brb-primary" /> Specifications
              </h2>
              <div>
                <label htmlFor="dimensions" className={labelClass}>
                  Dimensions (e.g., L x W x H)
                </label>
                <input
                  id="dimensions"
                  type="text"
                  placeholder="e.g., 15cm x 10cm x 5cm"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="weight" className={labelClass}>
                  Weight
                </label>
                <input
                  id="weight"
                  type="text"
                  placeholder="e.g., 1.2 kg"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="material" className={labelClass}>
                  Material
                </label>
                <input
                  id="material"
                  type="text"
                  placeholder="e.g., Ceramic, Wood, Canvas"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className={inputClass}
                />
              </div>
            </section>

            {/* Description */}
            <section className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FaPencilAlt className="mr-2 text-brb-primary" /> Product
                Description
              </h2>
              <div>
                <label htmlFor="description" className={labelClass}>
                  Description
                </label>
                <textarea
                  id="description"
                  rows="6" // Increased rows for better editing experience
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className={`${inputClass} resize-y`} // Allow vertical resizing
                ></textarea>
              </div>
            </section>

            {/* Image Upload Section */}
            <section className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FaPalette className="mr-2 text-brb-primary" /> Product Images
              </h2>
              <div className="flex flex-wrap gap-4 mb-4 p-2 border border-dashed border-gray-300 rounded-lg bg-white min-h-[8rem] items-center justify-center relative">
                {images.length === 0 && !loadingUpload && (
                  <p className="text-gray-500 text-center text-sm">
                    No images uploaded yet. Click "Upload Image" to add some.
                  </p>
                )}
                {images.map((image, index) => (
                  <motion.div
                    key={image} // Use image URL as key for unique identification
                    className="relative group w-28 h-28 object-cover rounded-md shadow-sm overflow-hidden"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    layout
                  >
                    <img
                      src={image}
                      alt={`Product view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeMedia(image, "image")}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      title="Remove image"
                    >
                      <FaTimes size={12} />
                    </button>
                  </motion.div>
                ))}
                {loadingUpload && ( // Show loader right within the preview area
                  <div className="flex items-center justify-center w-28 h-28 bg-gray-100 rounded-md">
                    <ClipLoader size={30} color="#BFA181" />
                  </div>
                )}
              </div>
              <label
                htmlFor="image-upload"
                className="cursor-pointer inline-flex items-center px-5 py-2.5 bg-brb-primary text-white rounded-md font-semibold text-sm hover:bg-brb-primary-dark transition-colors duration-200 shadow-md"
              >
                <FaUpload className="mr-2" /> Upload New Image
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={(e) => uploadFileHandler(e, "image")}
                className="hidden"
                disabled={loadingUpload} // Disable input during upload
              />
            </section>

            {/* Video Upload Section */}
            <section className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FaUpload className="mr-2 text-brb-primary" /> Product Videos
              </h2>
              <div className="flex flex-wrap gap-4 mb-4 p-2 border border-dashed border-gray-300 rounded-lg bg-white min-h-[8rem] items-center justify-center relative">
                {videos.length === 0 && !loadingUpload && (
                  <p className="text-gray-500 text-center text-sm">
                    No videos uploaded yet. Click "Upload Video" to add some.
                  </p>
                )}
                {videos.map((video, index) => (
                  <motion.div
                    key={video} // Use video URL as key
                    className="relative group w-28 h-28 bg-black rounded-md shadow-sm overflow-hidden flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    layout
                  >
                    <video
                      src={video}
                      controls // Add controls to allow playback in preview
                      className="max-w-full max-h-full object-cover"
                    ></video>
                    <button
                      type="button"
                      onClick={() => removeMedia(video, "video")}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      title="Remove video"
                    >
                      <FaTimes size={12} />
                    </button>
                  </motion.div>
                ))}
                {loadingUpload && ( // Show loader right within the preview area
                  <div className="flex items-center justify-center w-28 h-28 bg-gray-100 rounded-md">
                    <ClipLoader size={30} color="#BFA181" />
                  </div>
                )}
              </div>
              <label
                htmlFor="video-upload"
                className="cursor-pointer inline-flex items-center px-5 py-2.5 bg-brb-primary text-white rounded-md font-semibold text-sm hover:bg-brb-primary-dark transition-colors duration-200 shadow-md"
              >
                <FaUpload className="mr-2" /> Upload New Video
              </label>
              <input
                id="video-upload"
                type="file"
                accept="video/*"
                onChange={(e) => uploadFileHandler(e, "video")}
                className="hidden"
                disabled={loadingUpload} // Disable input during upload
              />
            </section>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loadingUpdate || loadingUpload}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold text-lg flex justify-center items-center shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loadingUpdate ? (
                  <ClipLoader size={24} color="white" />
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
