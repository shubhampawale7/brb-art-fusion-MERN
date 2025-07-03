import { motion } from "framer-motion";
import { FaAward, FaShippingFast, FaHeadset } from "react-icons/fa";

// --- PromiseItem Card Component with "Golden Accent Reveal" Hover Effect ---
const PromiseItem = ({ icon, title, text, delay }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: delay,
      },
    },
  };

  return (
    // Add `group` to the parent div to coordinate hover effects on children
    <motion.div
      variants={cardVariants}
      className="group relative bg-card-bg p-8 rounded-xl border border-gray-200 shadow-sm
                 overflow-hidden transition-all duration-300 ease-in-out
                 hover:shadow-lg hover:shadow-brand-gold/10 hover:-translate-y-2"
    >
      <div className="relative z-10">
        {/* Icon Container - Now scales up slightly on hover */}
        <div
          className="inline-flex h-16 w-16 items-center justify-center
                     rounded-full bg-brand-gold/10 mb-6
                     transition-transform duration-300 ease-in-out
                     group-hover:scale-110"
        >
          <span className="text-3xl text-brand-gold">{icon}</span>
        </div>

        {/* Heading - Remains the same, but benefits from parent hover */}
        <h3 className="text-2xl font-serif font-bold text-text-primary mb-3">
          {title}
        </h3>

        {/* Body - Remains the same */}
        <p className="font-sans text-text-secondary leading-relaxed">{text}</p>
      </div>

      {/* Golden Accent Line - Hidden by default, animates in on hover */}
      <div
        className="absolute bottom-0 left-0 h-1 w-full bg-brand-accent
                   origin-left transform scale-x-0
                   transition-transform duration-400 ease-in-out
                   group-hover:scale-x-100"
      />
    </motion.div>
  );
};

// --- Main BrandPromise Section Component (No changes from before) ---
const BrandPromiseSection = () => {
  const promises = [
    {
      icon: <FaAward />,
      title: "Artisan Crafted",
      text: "Every piece is uniquely crafted with passion and precision by our skilled artisans.",
    },
    {
      icon: <FaShippingFast />,
      title: "Insured Shipping",
      text: "We provide swift and secure shipping on all orders, delivered with the utmost care.",
    },
    {
      icon: <FaHeadset />,
      title: "Dedicated Support",
      text: "Our knowledgeable and friendly team is here to help you with any questions.",
    },
  ];

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  return (
    <motion.section
      className="py-20 sm:py-28 bg-page-bg"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={sectionVariants}
    >
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          variants={headerVariants}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-text-primary">
            Our Unwavering Promise
          </h2>
          <p className="font-sans text-lg text-text-secondary mt-4">
            An experience rooted in quality, authenticity, and a commitment to
            your satisfaction.
          </p>
        </motion.div>

        {/* Grid of Promises */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {promises.map((promise, index) => (
            <PromiseItem
              key={index}
              icon={promise.icon}
              title={promise.title}
              text={promise.text}
              delay={index * 0.15}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default BrandPromiseSection;
