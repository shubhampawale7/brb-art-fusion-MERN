import { motion } from "framer-motion";
import AccordionItem from "../common/AccordionItem";

const Faqs = () => {
  return (
    <motion.section
      className="py-20"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-6 max-w-4xl">
        <h2 className="text-4xl font-bold text-center mb-12">
          Frequently Asked Questions
        </h2>
        <div className="space-y-2">
          <AccordionItem title="What are your products made of?">
            All our products are crafted from high-quality, solid brass to
            ensure longevity and a premium finish.
          </AccordionItem>
          <AccordionItem title="How do I care for my brass items?">
            Gently wipe with a soft, dry cloth. Avoid harsh chemicals. Natural
            patina may develop over time, which adds to the character of the
            piece.
          </AccordionItem>
          <AccordionItem title="What is your return policy?">
            We offer a 15-day return policy for items in their original
            condition. Please visit our returns page for more details.
          </AccordionItem>
        </div>
      </div>
    </motion.section>
  );
};

export default Faqs;
