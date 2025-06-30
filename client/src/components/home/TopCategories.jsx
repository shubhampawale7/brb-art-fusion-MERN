import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import { motion } from "framer-motion";

// Helper function to map category names to specific images
const getCategoryImage = (categoryName) => {
  const images = {
    "Brass Murtis":
      "https://res.cloudinary.com/dfrjloqgb/image/upload/v1751297529/brb-art-fusion/di8ba1jhuq3htttdiom3.jpg",
    "Pooja Items":
      "https://res.cloudinary.com/dfrjloqgb/image/upload/v1751297327/brb-art-fusion/n1gxjwqbinmelve2nsvb.jpg",
    Drinkware:
      "https://images.unsplash.com/photo-1567082424799-a8647e335e44?q=80",
    Gifting:
      "https://images.unsplash.com/photo-1589913963837-1693636f8697?q=80",
    Kitchenware:
      "https://images.unsplash.com/photo-1581750242215-37655859e3b9?q=80",

    "Wall Decor":
      "https://images.unsplash.com/photo-1618693427179-8c43c24cee18?q=80",

    "Decorative Items":
      "https://res.cloudinary.com/dfrjloqgb/image/upload/v1751296602/brb-art-fusion/vkwhlhp85lkgymbp2gev.jpg",
    Lanterns:
      "https://res.cloudinary.com/dfrjloqgb/image/upload/v1751296732/brb-art-fusion/jgivspzhfntgyjhriszy.jpg",
  };
  return images[categoryName] || images["Decorative Items"]; // Fallback image
};

const TopCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await API.get("/products/categories");
        // We'll take the first 6 to match the design
        setCategories(data.slice(0, 6));
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <motion.section
      className="py-20"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold font-serif">Top Categories</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <Link
              to={`/shop/category/${category}`}
              key={category}
              className="block group"
            >
              <div className="relative overflow-hidden rounded-lg shadow-lg aspect-square">
                <img
                  src={getCategoryImage(category)}
                  alt={category}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all duration-300"></div>
                <div className="absolute bottom-0 left-0 p-4">
                  <h3 className="text-white text-lg font-semibold font-serif">
                    {category}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default TopCategories;
