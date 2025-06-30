import { motion } from "framer-motion";

const HandcraftedPromise = () => {
  return (
    <motion.section
      className="bg-brand-accent text-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1 }}
    >
      <div className="container mx-auto px-6 py-20 text-center">
        <h2 className="text-8xl md:text-9xl font-serif font-bold opacity-80">
          100%
        </h2>
        <h3 className="text-4xl font-serif font-bold mt-2 tracking-widest">
          HANDCRAFTED
        </h3>
        <p className="text-lg max-w-3xl mx-auto mt-4 opacity-90 leading-relaxed">
          Our artisans blend tradition with innovation, crafting each brass,
          pital, and kansa utensil by hand. These eco-friendly, durable pieces
          preserve India's rich heritage while redefining modern kitchenware.
        </p>
      </div>
    </motion.section>
  );
};

export default HandcraftedPromise;
