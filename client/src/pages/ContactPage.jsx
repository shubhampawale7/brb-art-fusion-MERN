import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  FiMapPin, // New: For address
  FiMail, // New: For email
  FiPhone, // New: For phone
  FiClock, // New: For business hours
  FiSend, // New: For send message button
  FiUser, // New: For name input
  FiLayers, // New: For subject input
} from "react-icons/fi"; // Using Feather Icons for consistency
import API from "../services/api";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";

const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/contact", { name, email, subject, message });
      toast.success(
        "Your message has been sent successfully! We'll get back to you soon."
      );
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  // Framer Motion variants for section entry
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  // Framer Motion variants for input fields (staggered)
  const inputVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - BRB Art Fusion</title>
        <meta
          name="description"
          content="Get in touch with BRB Art Fusion. We'd love to hear from you."
        />
      </Helmet>

      <div className="bg-gray-50 min-h-screen">
        {" "}
        {/* Lighter background */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
          {" "}
          {/* More padding */}
          {/* Hero Section */}
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">
              {" "}
              {/* Larger, bolder heading */}
              Get In Touch
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mt-2 max-w-3xl mx-auto">
              {" "}
              {/* Larger, softer text */}
              We'd love to hear from you! Whether you have a question, a
              comment, or just want to say hello, feel free to reach out.
            </p>
          </motion.div>
          {/* Main Content Grid */}
          <div className="bg-white p-6 md:p-10 rounded-xl shadow-2xl grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 border border-gray-100">
            {" "}
            {/* Stronger shadow, softer corners, border */}
            {/* Contact Form Section */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={sectionVariants}
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-8">
                Send us a Message
              </h2>
              <form onSubmit={submitHandler} className="space-y-5">
                {" "}
                {/* Increased spacing */}
                <motion.div variants={inputVariants}>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brb-primary focus:border-brb-primary outline-none transition text-gray-800"
                    />
                  </div>
                </motion.div>
                <motion.div
                  variants={inputVariants}
                  transition={{ delay: 0.1 }}
                >
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      placeholder="Your Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brb-primary focus:border-brb-primary outline-none transition text-gray-800"
                    />
                  </div>
                </motion.div>
                <motion.div
                  variants={inputVariants}
                  transition={{ delay: 0.2 }}
                >
                  <div className="relative">
                    <FiLayers className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                      className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brb-primary focus:border-brb-primary outline-none transition text-gray-800"
                    />
                  </div>
                </motion.div>
                <motion.div
                  variants={inputVariants}
                  transition={{ delay: 0.3 }}
                >
                  <textarea
                    placeholder="Your Message"
                    rows="6" // Increased rows for more space
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brb-primary focus:border-brb-primary outline-none transition text-gray-800 resize-y" // Added resize-y
                  ></textarea>
                </motion.div>
                <motion.button
                  type="submit"
                  disabled={loading}
                  variants={inputVariants} // Animate the button too
                  transition={{ delay: 0.4 }}
                  className="w-full bg-brb-primary text-white py-3 rounded-lg hover:bg-brb-primary-dark transition-colors flex justify-center items-center font-semibold text-lg shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <ClipLoader size={24} color="white" />
                  ) : (
                    <>
                      <FiSend className="mr-2" /> Send Message
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
            {/* Contact Information Section */}
            <motion.div
              className="space-y-8 md:space-y-10" // Increased spacing
              initial="hidden"
              animate="visible"
              variants={sectionVariants}
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Our Details
              </h2>
              {/* Individual Contact Info Blocks */}
              <motion.div variants={inputVariants} transition={{ delay: 0.1 }}>
                <div className="flex items-start p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
                  {" "}
                  {/* Card-like info block */}
                  <FiMapPin className="text-3xl text-brb-primary mt-1 mr-5 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      Our Address
                    </h3>
                    <p className="text-gray-700 text-base">
                      123 Artisan Lane, Pune, Maharashtra, 411001, India
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={inputVariants} transition={{ delay: 0.2 }}>
                <div className="flex items-start p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
                  <FiMail className="text-3xl text-brb-primary mt-1 mr-5 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      Email Us
                    </h3>
                    <p className="text-gray-700 text-base">
                      <a
                        href="mailto:contact@brbartfusion.com"
                        className="hover:text-brb-primary transition-colors"
                      >
                        contact@brbartfusion.com
                      </a>
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={inputVariants} transition={{ delay: 0.3 }}>
                <div className="flex items-start p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
                  <FiPhone className="text-3xl text-brb-primary mt-1 mr-5 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      Call Us
                    </h3>
                    <p className="text-gray-700 text-base">
                      <a
                        href="tel:+919876543210"
                        className="hover:text-brb-primary transition-colors"
                      >
                        +91 987 654 3210
                      </a>
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={inputVariants} transition={{ delay: 0.4 }}>
                <div className="flex items-start p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
                  <FiClock className="text-3xl text-brb-primary mt-1 mr-5 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      Business Hours
                    </h3>
                    <p className="text-gray-700 text-base">
                      Monday - Saturday: 10:00 AM - 7:00 PM
                    </p>
                    <p className="text-gray-700 text-base">
                      Sunday: By Appointment Only
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Google Maps Embed */}
              <motion.div
                className="mt-8 h-64 md:h-80 lg:h-96 rounded-xl overflow-hidden shadow-xl border border-gray-100" // Larger map, rounded-xl
                variants={inputVariants}
                transition={{ delay: 0.5 }}
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15124.634674753066!2d73.8449079!3d18.62580795!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2b9d2f2d9f9d7%3A0x6b4c3e8e2e9c2b4e!2sPune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Our Location on Map" // Added title for accessibility
                ></iframe>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
