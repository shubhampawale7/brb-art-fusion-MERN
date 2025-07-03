import { motion } from "framer-motion";
import { FaAward, FaShippingFast, FaHeadset } from "react-icons/fa";

// --- "Polished Liquid Metal" PromiseItem Card ---
const PromiseItem = ({ icon, title, text, animationDelay }) => {
  const cardVariants = {
    hidden: { opacity: 0, filter: "blur(8px)", y: 30 },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        duration: 0.8,
        delay: animationDelay,
        ease: [0.22, 1, 0.36, 1], // A very smooth 'out-expo' ease
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      className="group relative rounded-2xl overflow-hidden
                 bg-gradient-to-br from-brand-gold to-brand-accent
                 transition-all duration-500 ease-in-out"
    >
      {/* Muted Overlay that fades on hover */}
      <div className="absolute inset-0 bg-black/40 transition-all duration-500 group-hover:bg-black/10"></div>

      <div className="relative p-8 text-center h-full flex flex-col items-center justify-center">
        {/* Debossed Icon Effect */}
        <div
          className="mb-6 flex h-20 w-20 items-center justify-center rounded-full
                     bg-black/20 shadow-[inset_0_4px_8px_rgba(0,0,0,0.4)]
                     transition-all duration-500 group-hover:bg-black/10"
        >
          <span className="text-4xl text-black/50 transition-all duration-500 group-hover:text-white/80">
            {icon}
          </span>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <h3 className="relative mb-3 text-2xl font-serif font-semibold text-white/90 tracking-wide">
            {title}
            {/* Animated Underline */}
            <span
              className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 h-[2px] w-1/3
                         bg-brand-gold
                         origin-center scale-x-0 transition-transform duration-500 ease-in-out
                         group-hover:scale-x-100"
            />
          </h3>
          <p className="text-white/70 leading-relaxed transition-colors duration-500 group-hover:text-white/80">
            {text}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main BrandPromise Component (No changes needed) ---
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
