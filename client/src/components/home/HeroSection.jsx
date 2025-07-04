import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const HeroSection = () => (
  <div className="relative h-[85vh] flex items-center justify-center text-white text-center overflow-hidden">
    <div className="absolute inset-0 w-full h-full">
      <video
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/videos/hero_vid.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-black opacity-50"></div>
    </div>
    <motion.div
      className="relative z-10 p-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1 className="text-5xl md:text-7xl font-bold font-serif leading-tight">
        Artistry in Brass
      </h1>
      <p className="text-lg md:text-xl mt-4 max-w-2xl mx-auto">
        Discover exquisite, handcrafted art that brings heritage and elegance to
        your home.
      </p>
      <Link
        to="/shop"
        className="mt-8 inline-block bg-brand-accent text-white px-10 py-4 rounded-md text-lg font-semibold hover:bg-opacity-90 transition-transform hover:scale-105"
      >
        Explore The Collection
      </Link>
    </motion.div>
  </div>
);

export default HeroSection;
