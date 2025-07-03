import { useEffect, useRef } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";

const HandcraftedPromise = () => {
  // 1. A ref to track the element we want to animate (the h2)
  const ref = useRef(null);

  // 2. useInView hook to detect when the ref (our h2) is in the viewport
  //    'once: true' ensures the animation only runs once
  const isInView = useInView(ref, { once: true });

  // 3. A motion value that will hold the animated number, starting from 0
  const count = useMotionValue(0);

  // 4. A transformed motion value that rounds the number and adds a "%"
  const rounded = useTransform(count, (latest) => `${Math.round(latest)}%`);

  // 5. useEffect to start the animation when the element is in view
  useEffect(() => {
    if (isInView) {
      // Animate the 'count' motion value from 0 to 100
      animate(count, 100, {
        duration: 2.5, // Animation duration in seconds
        ease: "easeOut", // Starts fast and slows down at the end
      });
    }
  }, [isInView, count]); // Effect dependencies

  return (
    <motion.section
      className="bg-brand-accent text-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1 }}
    >
      <div className="container mx-auto px-6 py-20 text-center">
        {/* We attach the ref here and change h2 to motion.h2 */}
        <motion.h2
          ref={ref}
          className="text-8xl md:text-9xl font-serif font-bold opacity-80"
        >
          {/* Display the animated 'rounded' motion value */}
          {rounded}
        </motion.h2>
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
