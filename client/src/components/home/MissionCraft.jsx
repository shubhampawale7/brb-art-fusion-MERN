import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Data for the two slides
const contentData = [
  {
    id: 1,
    superTitle: "01",
    title: "Our Mission",
    text: "With a fervent desire to revive traditional handicrafts, BRB Art Fusion's foundation lies in fostering wellness in everyday lives. We offer an array of distinctive, handcrafted treasures, extending beyond commerce to nurturing a happier, healthier world.",
    image: "https://images.unsplash.com/photo-1605379649098-b873832c8623?q=80",
  },
  {
    id: 2,
    superTitle: "02",
    title: "Crafted by Master Artisans",
    text: "We take pride in preserving the authenticity and originality of our craft. Our artisans blend traditional methods with innovative designs, creating utensils that are not only functional but also beautiful works of art.",
    image: "https://images.unsplash.com/photo-1616401784845-180844d18104?q=80",
  },
];

const MissionCraft = () => {
  const [activeTab, setActiveTab] = useState(0);

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 1.05 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.7 } },
    exit: { opacity: 0, scale: 1.05, transition: { duration: 0.4 } },
  };

  return (
    <section className="bg-brand-accent text-white">
      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Text Content */}
          <div className="relative h-96">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <span className="font-semibold text-lg opacity-60">
                  {contentData[activeTab].superTitle}
                </span>
                <h2 className="text-4xl lg:text-5xl font-bold font-serif my-4">
                  {contentData[activeTab].title}
                </h2>
                <p className="text-lg opacity-90 leading-relaxed">
                  {contentData[activeTab].text}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="absolute bottom-0 left-0 flex items-center gap-4">
              <button
                onClick={() => setActiveTab(0)}
                className={`h-3 w-12 rounded-full ${
                  activeTab === 0 ? "bg-white" : "bg-white bg-opacity-30"
                }`}
              ></button>
              <button
                onClick={() => setActiveTab(1)}
                className={`h-3 w-12 rounded-full ${
                  activeTab === 1 ? "bg-white" : "bg-white bg-opacity-30"
                }`}
              ></button>
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="relative h-96 w-full">
            <AnimatePresence>
              <motion.img
                key={activeTab}
                src={contentData[activeTab].image}
                alt={contentData[activeTab].title}
                variants={imageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-2xl"
              />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionCraft;
