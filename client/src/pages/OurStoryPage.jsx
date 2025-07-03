import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  FiFeather, // For Authenticity
  FiAward, // For Craftsmanship (replaces FaHandSparkles)
  FiGift, // For Elegance (replaces FaGem)
  FiGrid, // New icon for hero section, for visual interest
  FiCheckCircle, // For TimelineItem numbers (if not explicitly numbered)
} from "react-icons/fi"; // Using Feather Icons for consistency

// --- TimelineItem Component (Defined directly within this file) ---
const TimelineItem = ({ number, title, text, index }) => {
  const itemVariants = {
    hidden: { opacity: 0, x: -50 }, // Starts hidden, off-left
    visible: {
      opacity: 1,
      x: 0, // Slides into view
      transition: {
        duration: 0.6,
        delay: index * 0.2, // Stagger delay based on index
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      className="flex items-start relative pb-10 last:pb-0" // relative for line, increased padding-bottom
      variants={itemVariants}
      initial="hidden"
      whileInView="visible" // Animates when in viewport
      viewport={{ once: true, amount: 0.5 }} // Trigger when 50% of component is in view, only once
    >
      {/* Connector Line (visible only if not the last item) */}
      {/* Absolute positioning makes it background to the circle */}
      {index !== undefined &&
        index < 3 && ( // Only draw line for first 3 items (connecting 1 to 2, 2 to 3, 3 to 4)
          <div className="absolute left-6 top-0 h-full w-0.5 bg-gray-200"></div>
        )}

      {/* Circle Icon/Number */}
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-brb-primary text-white font-extrabold text-xl shrink-0 relative z-10 shadow-md">
        {" "}
        {/* Branded color, stronger font, shadow */}
        {/* Render number if provided, otherwise a checkmark icon */}
        {number ? number : <FiCheckCircle className="text-2xl" />}
      </div>
      <div className="ml-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>{" "}
        {/* Darker text, more margin */}
        <p className="text-gray-700 leading-relaxed text-base">{text}</p>{" "}
        {/* Darker text, better line height */}
      </div>
    </motion.div>
  );
};

// --- OurStoryPage Component ---
const OurStoryPage = () => {
  // Framer Motion variants for section entry (fade in from bottom)
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  // Framer Motion variants for individual value cards (staggered scale/fade)
  const valueCardVariants = {
    hidden: { opacity: 0, scale: 0.8 }, // Starts smaller and hidden
    visible: (i) => ({
      // Uses custom prop 'i' for stagger
      opacity: 1,
      scale: 1, // Scales up to full size
      transition: {
        delay: i * 0.2, // Stagger delay based on index (0.2s between cards)
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };

  return (
    <>
      <Helmet>
        <title>Our Story - BRB Art Fusion</title>
        <meta
          name="description"
          content="Discover the story, mission, and craftsmanship behind BRB Art Fusion. A legacy of artistry in brass."
        />
      </Helmet>

      {/* --- Hero Section --- */}
      <section className="relative h-[60vh] flex items-center justify-center text-white text-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1737315551644-ef48f2ea8d40?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Artisan crafting brass"
          className="absolute inset-0 w-full h-full object-cover transform scale-110" // Subtle zoom on background image
        />
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>{" "}
        {/* Darker overlay for text readability */}
        <motion.div
          className="relative z-10 p-4"
          initial={{ opacity: 0, y: 30 }} // Text fades in and slides up
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold font-serif leading-tight">
            Our Story
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mt-4 font-medium max-w-2xl mx-auto">
            The Soul of a Craft, The Heart of a Home.
          </p>
        </motion.div>
      </section>

      {/* --- Mission Section --- */}
      <section className="py-20 bg-gray-50">
        {" "}
        {/* Lighter background for contrast */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden" // Text block animates
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }} // Trigger when 40% in view
            variants={sectionVariants}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold font-serif mb-6 text-gray-900 leading-tight">
              From a Humble Workshop to Your Home
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg mb-4">
              BRB Art Fusion was born from a deep-rooted love for India's rich
              artistic heritage. We saw the incredible skill of local artisans
              and the timeless beauty of brasswork, and we knew we had to share
              it with the world. Our mission is to create a bridge between these
              master craftsmen and discerning patrons like you who appreciate
              art with a soul.
            </p>
            <p className="text-gray-700 leading-relaxed text-lg">
              We believe in preserving traditional art forms while bringing them
              into contemporary living spaces. Every piece tells a story of
              dedication, skill, and passion passed down through generations.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }} // Image animates
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <img
              src="https://images.unsplash.com/photo-1617048213128-d2265ab51303?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Collection of brass items"
              className="rounded-xl shadow-2xl border border-gray-100" /* Stronger shadow, softer corners, border */
            />
          </motion.div>
        </div>
      </section>

      {/* --- Our Process Section (Timeline) --- */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold font-serif text-gray-900 mb-4">
              The Journey of a Masterpiece
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From raw material to a gleaming work of art, experience the
              meticulous process behind every BRB Art Fusion creation.
            </p>
          </div>
          <div className="relative space-y-12">
            {/* Timeline Items - each animates with stagger */}
            <TimelineItem
              number="1"
              title="Sourcing & Purity"
              text="Our journey begins by sourcing the purest quality brass, ensuring every piece starts with an uncompromised foundation."
              index={0} // Pass index for staggered animation
            />
            <TimelineItem
              number="2"
              title="Hand-Casting & Shaping"
              text="Using age-old techniques, our artisans meticulously hand-cast and shape the molten metal into its timeless form."
              index={1}
            />
            <TimelineItem
              number="3"
              title="Intricate Detailing"
              text="Each piece is then passed to a master carver who etches intricate details and patterns, giving it a unique soul."
              index={2}
            />
            <TimelineItem
              number="4"
              title="Polishing & Finishing"
              text="Finally, every item is hand-polished to achieve its signature lustrous glow, ready to bring elegance to your home."
              index={3}
            />
          </div>
        </div>
      </section>

      {/* --- Our Values Section --- */}
      <section className="py-20 bg-gray-50">
        {" "}
        {/* Lighter background for contrast */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold font-serif text-gray-900 mb-4">
              Our Promise
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Dedicated to authenticity, superior craftsmanship, and timeless
              elegance in every brass piece we offer.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 md:gap-10 lg:gap-12 text-center">
            <motion.div
              custom={0} // Pass index for stagger
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={valueCardVariants}
              className="p-8 bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col items-center justify-center" /* Card styling */
            >
              <FiFeather className="text-5xl text-brb-primary mx-auto mb-5" />{" "}
              {/* Branded icon */}
              <h3 className="text-2xl font-bold font-serif mb-3 text-gray-900">
                Authenticity
              </h3>
              <p className="text-gray-700 leading-relaxed text-base">
                Honoring traditional techniques and materials to create genuine
                works of art with a verifiable legacy.
              </p>
            </motion.div>
            <motion.div
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={valueCardVariants}
              className="p-8 bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col items-center justify-center"
            >
              <FiAward className="text-5xl text-brb-primary mx-auto mb-5" />
              <h3 className="text-2xl font-bold font-serif mb-3 text-gray-900">
                Craftsmanship
              </h3>
              <p className="text-gray-700 leading-relaxed text-base">
                Upholding the highest standards of quality, detail, and
                durability in every piece, crafted by master artisans.
              </p>
            </motion.div>
            <motion.div
              custom={2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={valueCardVariants}
              className="p-8 bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col items-center justify-center"
            >
              <FiGift className="text-5xl text-brb-primary mx-auto mb-5" />
              <h3 className="text-2xl font-bold font-serif mb-3 text-gray-900">
                Elegance
              </h3>
              <p className="text-gray-700 leading-relaxed text-base">
                Designing timeless pieces that add a touch of sophistication and
                grace to any space, a true reflection of beauty.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default OurStoryPage;
