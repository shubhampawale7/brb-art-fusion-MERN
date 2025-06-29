import { motion } from "framer-motion";
import { FaAward, FaShippingFast, FaHeadset } from "react-icons/fa";

const PromiseItem = ({ icon, title, text }) => (
  <div className="text-center p-4">
    <div className="flex justify-center items-center mb-4">{icon}</div>
    <h3 className="text-xl font-serif font-bold mb-2">{title}</h3>
    <p className="text-gray-600">{text}</p>
  </div>
);

const BrandPromise = () => {
  return (
    <motion.section
      className="py-20"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x">
          <PromiseItem
            icon={<FaAward className="text-5xl text-brand-gold" />}
            title="100% Handcrafted"
            text="Every piece is uniquely crafted by skilled artisans."
          />
          <PromiseItem
            icon={<FaShippingFast className="text-5xl text-brand-gold" />}
            title="Free & Fast Shipping"
            text="On all orders above ₹2000, delivered with care."
          />
          <PromiseItem
            icon={<FaHeadset className="text-5xl text-brand-gold" />}
            title="Dedicated Support"
            text="Our team is here to help with any questions."
          />
        </div>
      </div>
    </motion.section>
  );
};

export default BrandPromise;
