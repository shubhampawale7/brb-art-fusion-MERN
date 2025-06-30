import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const MetalCard = ({ to, imgSrc, alt, title, className, textClassName }) => (
  <Link
    to={to}
    className={`relative block overflow-hidden rounded-lg shadow-lg group ${className}`}
  >
    <img
      src={imgSrc}
      alt={alt}
      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
    />
    <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
    <div className={`absolute bottom-4 right-4`}>
      <h3 className={`text-white font-serif font-bold ${textClassName}`}>
        {title}
      </h3>
    </div>
  </Link>
);

const ShopByMetal = () => {
  return (
    <motion.section
      className="py-20 bg-soft-gray"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-6">
        <div className="text-left mb-12">
          <h2 className="text-4xl font-bold font-serif">Shop By Metals</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-2 gap-8 h-[600px]">
          <MetalCard
            to="/shop/category/Copper"
            imgSrc="https://images.unsplash.com/photo-1612529891148-4d8724645232?q=80"
            alt="Copper Products"
            title="Copper"
            className="row-span-1"
            textClassName="text-2xl"
          />
          <MetalCard
            to="/shop/category/Bronze"
            imgSrc="https://images.unsplash.com/photo-1599409353925-e8224433189e?q=80"
            alt="Bronze Products"
            title="Bronze"
            className="row-span-1"
            textClassName="text-2xl"
          />
          <MetalCard
            to="/shop/category/Brass"
            imgSrc="https://images.unsplash.com/photo-1620757236241-1295a7c73245?q=80"
            alt="Brass Products"
            title="Brass"
            className="row-span-2"
            textClassName="text-4xl"
          />
        </div>
      </div>
    </motion.section>
  );
};

export default ShopByMetal;
