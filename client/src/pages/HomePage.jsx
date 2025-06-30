import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import API from "../services/api";
import { toast } from "sonner";

// Import all our new section components
import HeroSection from "../components/home/HeroSection";
// import ShopByCategory from "../components/home/ShopByCategory";
import FeaturedProducts from "../components/home/FeaturedProducts";
import BrandPromise from "../components/home/BrandPromise";
import Testimonials from "../components/home/Testimonials";
import Faqs from "../components/home/Faqs";
import TopCategories from "../components/home/TopCategories";
import CustomerFavourite from "../components/home/CustomerFavourite";
// import ShopByMetal from "../components/home/ShopByMetal";
import ArtisanStory from "../components/home/ArtisanStory";
import HandcraftedPromise from "../components/home/HandcraftedPromise";
import InspirationSection from "../components/home/InspireSection";
import MissionCraft from "../components/home/MissionCraft";
import MaterialComparison from "../components/home/MaterialComparison";

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
      <TopCategories />
      <MaterialComparison />
      <BrandPromise />
      {/* <ShopByCategory /> */}
      {/* <ShopByMetal /> */}
      <FeaturedProducts products={products.slice(0, 8)} />

      <CustomerFavourite />
      <MissionCraft />
      <ArtisanStory />
      <HandcraftedPromise />
      <Testimonials />
      <Faqs />
      <InspirationSection />
    </>
  );
};

export default HomePage;
