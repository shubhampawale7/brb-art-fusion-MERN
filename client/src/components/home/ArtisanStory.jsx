import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

const ArtisanStory = () => {
  return (
    <motion.section
      className="py-20 bg-white"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Collage */}
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://cdn.shopify.com/s/files/1/0733/7676/0095/files/DSC3196_853d2ea0-096b-497e-839b-38a9d7a13206.jpg?v=1727726670"
              alt="Artisan crafting brass"
              className="rounded-lg shadow-lg object-left w-full h-96 col-span-2"
            />
            <img
              src="https://brassglobe.com/cdn/shop/files/WhatsApp_Image_2023-11-02_at_10.27.07_AM_2.webp?v=1728568017&width=500"
              alt="Artisan tools"
              className="rounded-lg shadow-lg object-fill w-full h-64"
            />
            <img
              src="https://brassglobe.com/cdn/shop/files/C1951_out0001.png?v=1727924506&width=500"
              alt="Finished brass products"
              className="rounded-lg shadow-lg object-left-bottom w-full h-64"
            />
          </div>

          {/* Text Content */}
          <div className="text-left">
            <h2 className="text-4xl font-bold font-serif text-text-primary">
              Perfection from Our Artisans
            </h2>
            <p className="text-lg text-text-secondary mt-4 leading-relaxed">
              Artisans crafting brass utensils in India play a crucial role in
              preserving the country's rich cultural heritage. For centuries,
              these skilled craftsmen have passed down traditional techniques
              through generations, creating utensils that are not just
              functional but also artistic masterpieces.
            </p>
            <p className="text-lg text-text-secondary mt-4 leading-relaxed">
              Each brass utensil, from intricate plates to elegant pots, tells a
              story of dedication and precision, helping to keep alive ancient
              customs while redefining modern kitchenware.
            </p>
            <Link
              to="/contact"
              className="mt-8 inline-block bg-brand-gold text-white px-8 py-3 rounded-md font-semibold hover:bg-opacity-90 transition-transform hover:scale-105"
            >
              Our Story
            </Link>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default ArtisanStory;
