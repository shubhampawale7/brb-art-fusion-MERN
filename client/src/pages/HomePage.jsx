import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import API from "../services/api";
import { toast } from "sonner";

// Import all our new section components
import HeroSection from "../components/home/HeroSection";
import ShopByCategory from "../components/home/ShopByCategory";
import FeaturedProducts from "../components/home/FeaturedProducts";
import BrandPromise from "../components/home/BrandPromise";
import Testimonials from "../components/home/Testimonials";
import Faqs from "../components/home/Faqs";

const HomePage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await API.get("/products");
        setProducts(data.products);
      } catch (error) {
        toast.error("Could not load products.");
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
      <Helmet>
        <title>BRB Art Fusion - Exquisite Brass Decor and Murtis</title>
        <meta
          name="description"
          content="Discover handcrafted brass murtis, lanterns, and decorative items. Timeless craftsmanship from BRB Art Fusion."
        />
      </Helmet>

      <HeroSection />
      <BrandPromise />
      <ShopByCategory />
      <FeaturedProducts products={products.slice(0, 8)} />
      <Testimonials />
      <Faqs />
    </>
  );
};

export default HomePage;
