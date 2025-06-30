import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ClipLoader } from "react-spinners";
import { FaTimes, FaUpload } from "react-icons/fa";

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
  const [loadingUpload, setLoadingUpload] = useState(false);

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
        toast.error("Could not fetch product details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId, navigate]);

  const uploadFileHandler = async (e, fileType) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    setLoadingUpload(true);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await API.post("/upload", formData, config);

      if (fileType === "image") setImages([...images, data.url]);
      else if (fileType === "video") setVideos([...videos, data.url]);

      toast.success("File uploaded successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "File upload failed");
    } finally {
      setLoadingUpload(false);
    }
  };

  const removeImage = (urlToRemove) =>
    setImages(images.filter((image) => image !== urlToRemove));
  const removeVideo = (urlToRemove) =>
    setVideos(videos.filter((video) => video !== urlToRemove));

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoadingUpdate(true);
    try {
      // --- FIX: Convert price and stock to Numbers before sending ---
      const productData = {
        name,
        price: Number(price),
        description,
        images,
        videos,
        category,
        countInStock: Number(countInStock),
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
        error?.response?.data?.message || "Failed to update product."
      );
    } finally {
      setLoadingUpdate(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={50} color="#BFA181" />
      </div>
    );

  const inputClass =
    "w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-accent focus:outline-none transition";

  return (
    <>
      <Helmet>
        <title>Edit Product - {name}</title>
      </Helmet>
      <div className="container mx-auto px-6 py-8">
        <Link
          to="/admin/productlist"
          className="text-brand-accent hover:underline mb-4 inline-block"
        >
          &larr; Go Back to Product List
        </Link>
        <motion.div
          className="bg-white p-8 rounded-lg shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-6 text-center">Edit Product</h1>
          <form onSubmit={submitHandler} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-1"
                >
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
                <label
                  htmlFor="price"
                  className="block text-sm font-medium mb-1"
                >
                  Price (₹)
                </label>
                <input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium mb-1"
                >
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
                <label
                  htmlFor="countInStock"
                  className="block text-sm font-medium mb-1"
                >
                  Count In Stock
                </label>
                <input
                  id="countInStock"
                  type="number"
                  value={countInStock}
                  onChange={(e) => setCountInStock(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="dimensions"
                  className="block text-sm font-medium mb-1"
                >
                  Dimensions
                </label>
                <input
                  id="dimensions"
                  type="text"
                  placeholder="e.g., 15cm x 10cm"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="weight"
                  className="block text-sm font-medium mb-1"
                >
                  Weight
                </label>
                <input
                  id="weight"
                  type="text"
                  placeholder="e.g., 1.2kg"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="material"
                className="block text-sm font-medium mb-1"
              >
                Material
              </label>
              <input
                id="material"
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                rows="5"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className={inputClass}
              ></textarea>
            </div>

            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Images
              </label>
              <div className="flex flex-wrap gap-4 mb-2 min-h-[6rem] p-2 border rounded-md bg-page-bg">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Product view ${index + 1}`}
                      className="w-24 h-24 object-cover rounded-md shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(image)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 leading-none"
                    >
                      <FaTimes size={10} />
                    </button>
                  </div>
                ))}
              </div>
              <label
                htmlFor="image-upload"
                className="cursor-pointer inline-flex items-center px-4 py-2 bg-gray-200 text-text-primary rounded-md font-semibold text-sm hover:bg-gray-300"
              >
                <FaUpload className="mr-2" /> Upload Image
              </label>
              <input
                id="image-upload"
                type="file"
                onChange={(e) => uploadFileHandler(e, "image")}
                className="hidden"
              />
            </div>

            {/* Video Upload Section */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Videos
              </label>
              <div className="flex flex-wrap gap-4 mb-2 min-h-[6rem] p-2 border rounded-md bg-page-bg">
                {videos.map((video, index) => (
                  <div
                    key={index}
                    className="relative w-24 h-24 bg-black rounded-md flex items-center justify-center"
                  >
                    <video
                      src={video}
                      className="max-w-full max-h-full"
                    ></video>
                    <button
                      type="button"
                      onClick={() => removeVideo(video)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 leading-none"
                    >
                      <FaTimes size={10} />
                    </button>
                  </div>
                ))}
              </div>
              <label
                htmlFor="video-upload"
                className="cursor-pointer inline-flex items-center px-4 py-2 bg-gray-200 text-text-primary rounded-md font-semibold text-sm hover:bg-gray-300"
              >
                <FaUpload className="mr-2" /> Upload Video
              </label>
              <input
                id="video-upload"
                type="file"
                accept="video/*"
                onChange={(e) => uploadFileHandler(e, "video")}
                className="hidden"
              />
            </div>

            {loadingUpload && (
              <div className="flex justify-center my-2">
                <ClipLoader size={25} />
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                disabled={loadingUpdate || loadingUpload}
                className="w-full bg-brand-accent text-white py-3 rounded-md hover:bg-opacity-90 transition font-semibold flex justify-center items-center disabled:bg-gray-400"
              >
                {loadingUpdate ? (
                  <ClipLoader size={20} color="white" />
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
