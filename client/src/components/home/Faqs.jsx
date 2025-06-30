import { motion } from "framer-motion";
import AccordionItem from "../common/AccordionItem";

const Faqs = () => {
  const faqData = [
    {
      question: "Do you ship overseas?",
      answer:
        "Yes, we ship our brass art pieces worldwide. Shipping charges and delivery times vary by location. Please proceed to checkout to see the options for your country.",
    },
    {
      question: "How long will it take to get my orders?",
      answer:
        "Domestic orders are typically delivered within 5-7 business days. International shipping can take between 10-21 days depending on customs clearance.",
    },
    {
      question: "Is it safe to cook with brass utensils?",
      answer:
        "Absolutely. Brass has been used for centuries and is known for its health benefits. Our kitchenware is crafted from food-safe, high-quality brass. For certain items, we also provide traditional tin-coating (kalai).",
    },
    {
      question: "How do I maintain and clean brass utensils?",
      answer:
        "Gently wipe with a soft, dry cloth for decorative items. For utensils, use a gentle soap with tamarind paste or a specialized brass cleaner like Pitambari to maintain their shine. Avoid abrasive scrubbers.",
    },
  ];

  return (
    <motion.section
      className="py-20"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Column */}
          <div>
            <img
              src="https://img.freepik.com/premium-photo/rustic-kitchen-shelf-adorned-with-various-brass-utensils-captures-glimpse-into-traditional-culinary-artistry-with-golden-warmth_95891-79547.jpg"
              alt="Brass products on a shelf"
              className="rounded-lg shadow-xl w-full h-full object-cover"
            />
          </div>

          {/* FAQ Accordion Column */}
          <div className="bg-brand-accent text-white p-8 rounded-lg shadow-lg">
            <h2 className="text-4xl font-bold font-serif mb-8">
              Have Questions?
            </h2>
            <div className="space-y-2">
              {faqData.map((faq, index) => (
                <AccordionItem key={index} title={faq.question}>
                  {faq.answer}
                </AccordionItem>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Faqs;
