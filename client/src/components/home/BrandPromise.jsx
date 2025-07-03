import { motion } from "framer-motion";
import { FaAward, FaShippingFast, FaHeadset } from "react-icons/fa";

// --- Redesigned PromiseItem Sub-Component ---
// "Polished Marble & Gold" Design: A luxurious, dark-themed card with dynamic glow effects.
const PromiseItem = ({ icon, title, text, animationDelay }) => {
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 40 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.7,
        delay: animationDelay,
        ease: [0.16, 1, 0.3, 1], // A sharp, impactful ease
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      className="group relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-slate-800 to-slate-900 p-8 transition-all duration-300 hover:border-brand-gold/30 hover:-translate-y-2"
    >
      {/* Background Glow Effect */}
      <div className="absolute -top-1/2 -right-1/3 w-full h-full bg-brand-gold/10 rounded-full blur-3xl opacity-40 transition-all duration-700 group-hover:opacity-70 group-hover:-right-1/4" />

      <div className="relative z-10">
        {/* Golden Medallion Icon */}
        <div className="mb-6 inline-block p-1 bg-gradient-to-br from-brand-gold to-brand-accent rounded-full transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_theme(colors.brand.gold)]">
          <div className="bg-slate-800 rounded-full p-3">
            <div className="text-3xl text-brand-gold">{icon}</div>
          </div>
        </div>

        {/* Content */}
        <h3 className="mb-3 text-2xl font-serif font-bold text-white/90">
          {title}
        </h3>
        <p className="text-white/60 leading-relaxed">{text}</p>
      </div>
    </motion.div>
  );
};

// --- Main BrandPromise Component (No changes needed here) ---
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
      delay: 0.2,
    },
    {
      icon: <FaHeadset />,
      title: "Dedicated Support",
      text: "Our knowledgeable and friendly team is here to help you with any questions.",
      delay: 0.4,
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-page-bg">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header with Gradient Text */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-serif font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-brand-accent">
            Our Unwavering Promise
          </h2>
          <p className="text-lg text-text-secondary mt-4">
            An experience rooted in quality, authenticity, and a commitment to
            your satisfaction.
          </p>
        </motion.div>

        {/* Grid of Promises with staggered animation */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {promises.map((promise) => (
            <PromiseItem
              key={promise.title}
              icon={promise.icon}
              title={promise.title}
              text={promise.text}
              animationDelay={promise.delay}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BrandPromise;
