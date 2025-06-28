import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { FaFeatherAlt, FaHandSparkles, FaGem } from "react-icons/fa"; // Example icons

const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>About Us - BRB Art Fusion</title>
        <meta
          name="description"
          content="Learn about the story, craftsmanship, and passion behind BRB Art Fusion's exquisite brass creations."
        />
      </Helmet>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header Section */}
        <div className="bg-gray-100 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-gray-800">
            Our Story & Craft
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Where Art, Heritage, and Passion Converge
          </p>
        </div>

        {/* Our Story Section */}
        <div className="py-20 container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-4">
              From a Humble Workshop to Your Home
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              BRB Art Fusion was born from a deep-rooted love for India's rich
              artistic heritage. We saw the incredible skill of local artisans
              and the timeless beauty of brasswork, and we knew we had to share
              it with the world. Our mission is to create a bridge between these
              master craftsmen and discerning patrons like you who appreciate
              art with a soul.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Every piece in our collection is more than just a decorative item;
              it's a piece of history, a carrier of culture, and a product of
              countless hours of dedicated labor. We are committed to fair trade
              practices, ensuring our artisans are valued and their craft can
              continue to thrive for generations to come.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <img
              src="https://images.unsplash.com/photo-1617347398863-2a366a75a7b8?q=80&w=1964"
              alt="Collection of brass items"
              className="rounded-lg shadow-2xl"
            />
          </motion.div>
        </div>

        {/* Our Values Section */}
        <div className="bg-gray-50 py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              Our Core Values
            </h2>
            <div className="grid md:grid-cols-3 gap-10 text-center">
              <div className="p-6">
                <FaFeatherAlt className="text-5xl text-[#BFA181] mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Authenticity</h3>
                <p className="text-gray-600">
                  Honoring traditional techniques and materials to create
                  genuine works of art.
                </p>
              </div>
              <div className="p-6">
                <FaHandSparkles className="text-5xl text-[#BFA181] mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Craftsmanship</h3>
                <p className="text-gray-600">
                  Upholding the highest standards of quality, detail, and
                  durability in every piece.
                </p>
              </div>
              <div className="p-6">
                <FaGem className="text-5xl text-[#BFA181] mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Elegance</h3>
                <p className="text-gray-600">
                  Designing timeless pieces that add a touch of sophistication
                  and grace to any space.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default AboutPage;
