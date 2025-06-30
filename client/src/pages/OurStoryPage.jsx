import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { FaFeatherAlt, FaHandSparkles, FaGem } from "react-icons/fa";

// A small component for timeline items
const TimelineItem = ({ number, title, text }) => (
  <div className="flex items-start">
    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-brand-accent text-white font-bold font-serif text-xl shrink-0">
      {number}
    </div>
    <div className="ml-6">
      <h3 className="text-xl font-bold text-text-primary mb-1">{title}</h3>
      <p className="text-text-secondary">{text}</p>
    </div>
  </div>
);

const OurStoryPage = () => {
  return (
    <>
      <Helmet>
        <title>Our Story - BRB Art Fusion</title>
        <meta
          name="description"
          content="Discover the story, mission, and craftsmanship behind BRB Art Fusion. A legacy of artistry in brass."
        />
      </Helmet>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* --- Hero Section --- */}
        <section className="relative h-[50vh] flex items-center justify-center text-white text-center">
          <img
            src="https://images.unsplash.com/photo-1737315551644-ef48f2ea8d40?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Artisan crafting brass"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="relative z-10">
            <h1 className="text-5xl md:text-7xl font-bold font-serif">
              Our Story
            </h1>
            <p className="text-lg md:text-xl mt-2">
              The Soul of a Craft, The Heart of a Home.
            </p>
          </div>
        </section>

        {/* --- Mission Section --- */}
        <section className="py-20 bg-page-bg">
          <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold font-serif mb-4">
                From a Humble Workshop to Your Home
              </h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                BRB Art Fusion was born from a deep-rooted love for India's rich
                artistic heritage. We saw the incredible skill of local artisans
                and the timeless beauty of brasswork, and we knew we had to
                share it with the world. Our mission is to create a bridge
                between these master craftsmen and discerning patrons like you
                who appreciate art with a soul.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <img
                src="https://images.unsplash.com/photo-1617048213128-d2265ab51303?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Collection of brass items"
                className="rounded-lg shadow-xl"
              />
            </motion.div>
          </div>
        </section>

        {/* --- Our Process Section (Timeline) --- */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold font-serif">
                The Journey of a Masterpiece
              </h2>
            </div>
            <div className="relative space-y-12">
              {/* The timeline line */}
              <div className="absolute left-6 top-0 h-full w-0.5 bg-gray-200"></div>
              <TimelineItem
                number="1"
                title="Sourcing & Purity"
                text="Our journey begins by sourcing the purest quality brass, ensuring every piece starts with an uncompromised foundation."
              />
              <TimelineItem
                number="2"
                title="Hand-Casting & Shaping"
                text="Using age-old techniques, our artisans meticulously hand-cast and shape the molten metal into its timeless form."
              />
              <TimelineItem
                number="3"
                title="Intricate Detailing"
                text="Each piece is then passed to a master carver who etches intricate details and patterns, giving it a unique soul."
              />
              <TimelineItem
                number="4"
                title="Polishing & Finishing"
                text="Finally, every item is hand-polished to achieve its signature lustrous glow, ready to bring elegance to your home."
              />
            </div>
          </div>
        </section>

        {/* --- Our Values Section --- */}
        <section className="py-20 bg-page-bg">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold font-serif text-center mb-12">
              Our Promise
            </h2>
            <div className="grid md:grid-cols-3 gap-10 text-center">
              <div className="p-6">
                <FaFeatherAlt className="text-5xl text-brand-accent mx-auto mb-4" />
                <h3 className="text-xl font-serif font-bold mb-2">
                  Authenticity
                </h3>
                <p className="text-text-secondary">
                  Honoring traditional techniques and materials to create
                  genuine works of art.
                </p>
              </div>
              <div className="p-6">
                <FaHandSparkles className="text-5xl text-brand-accent mx-auto mb-4" />
                <h3 className="text-xl font-serif font-bold mb-2">
                  Craftsmanship
                </h3>
                <p className="text-text-secondary">
                  Upholding the highest standards of quality, detail, and
                  durability in every piece.
                </p>
              </div>
              <div className="p-6">
                <FaGem className="text-5xl text-brand-accent mx-auto mb-4" />
                <h3 className="text-xl font-serif font-bold mb-2">Elegance</h3>
                <p className="text-text-secondary">
                  Designing timeless pieces that add a touch of sophistication
                  and grace to any space.
                </p>
              </div>
            </div>
          </div>
        </section>
      </motion.div>
    </>
  );
};

export default OurStoryPage;
