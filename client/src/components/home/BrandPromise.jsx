import { motion } from "framer-motion";
import { FaAward, FaShippingFast, FaHeadset } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi"; // A more elegant icon for links

// --- Redesigned PromiseItem Sub-Component ---
// This card is designed with focused typography, spacing, and interactive details.
const PromiseItem = ({ icon, title, text, animationDelay }) => (
  <motion.div
    className="bg-white p-8 rounded-lg border border-gray-200/80 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.5, delay: animationDelay }}
  >
    {/* Styled Icon Container */}
    <div className="w-16 h-16 rounded-full bg-brand-gold/10 flex items-center justify-center mb-6">
      <div className="text-3xl text-brand-gold">{icon}</div>
    </div>

    {/* Content */}
    <h3 className="text-2xl font-serif font-bold mb-3 text-gray-900">
      {title}
    </h3>
    <p className="text-gray-600 leading-relaxed">{text}</p>

    {/* Subtle interactive element that appears on hover */}
    <div className="mt-6">
      <FiArrowUpRight
        className="text-gray-300 transition-colors duration-300 group-hover:text-brand-accent"
        size={24}
      />
    </div>
  </motion.div>
);

// --- Main BrandPromise Component ---
const BrandPromise = () => {
  const promises = [
    {
      icon: <FaAward />,
      title: "100% Handcrafted",
      text: "Every piece is uniquely crafted with passion and precision by skilled artisans.",
      delay: 0,
    },
    {
      icon: <FaShippingFast />,
      title: "Free & Fast Shipping",
      text: "We provide swift, secure shipping on all orders above ₹2000, delivered with care.",
      delay: 0.15,
    },
    {
      icon: <FaHeadset />,
      title: "Dedicated Support",
      text: "Our knowledgeable and friendly team is here to help you with any questions.",
      delay: 0.3,
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-page-bg">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-text-primary">
            Our Unwavering Promise
          </h2>
          <p className="text-lg text-text-secondary mt-4">
            An experience rooted in quality, authenticity, and a commitment to
            your satisfaction.
          </p>
        </div>

        {/* Grid of Promises */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {promises.map((promise, index) => (
            <PromiseItem
              key={index}
              icon={promise.icon}
              title={promise.title}
              text={promise.text}
              animationDelay={promise.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandPromise;
