import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import { toast } from "sonner";

// Helper function to get a specific image for each category
const getCategoryImage = (categoryName) => {
  const images = {
    "Brass Murtis":
      "https://images.unsplash.com/photo-1617347398863-2a366a75a7b8?q=80",
    Lanterns:
      "https://images.unsplash.com/photo-1567082424799-a8647e335e44?q=80",
    "Decorative Items":
      "https://images.unsplash.com/photo-1581750242215-37655859e3b9?q=80",
    "Pooja Items":
      "https://images.unsplash.com/photo-1605379649098-b873832c8623?q=80", // Example image
    "Wall Decor":
      "https://images.unsplash.com/photo-1618693427179-8c43c24cee18?q=80", // Example image
  };
  // Return the specific image, or a default one if the category is new
  return (
    images[categoryName] ||
    "https://images.unsplash.com/photo-1599409353925-e8224433189e?q=80"
  );
};

const ShopByCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const { data } = await API.get("/products/categories");
        setCategories(data);
      } catch (error) {
        toast.error("Failed to load product categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const categoryItemStyle =
    "relative overflow-hidden rounded-lg shadow-lg group";
  const categoryOverlayStyle =
    "absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center";
  const categoryTextStyle =
    "text-white text-2xl font-bold font-serif text-center";

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold">Shop by Category</h2>
          <p className="text-lg text-text-secondary mt-2 max-w-2xl mx-auto">
            From divine idols that bless your home to ornate lanterns that cast
            a warm glow, discover timeless treasures crafted with passion.
          </p>
        </div>

        {loading ? (
          <p>Loading categories...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Map over the fetched categories to display them dynamically */}
            {categories.map((category) => (
              <Link
                key={category}
                to={`/shop/category/${category}`}
                className={categoryItemStyle}
              >
                <img
                  src={getCategoryImage(category)}
                  alt={category}
                  className="w-full h-80 object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className={categoryOverlayStyle}>
                  <h3 className={categoryTextStyle}>{category}</h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ShopByCategory;
