import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaEnvelope, FaPhone } from "react-icons/fa";
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
      // Clear form
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

  return (
    <>
      <Helmet>
        <title>Contact Us - BRB Art Fusion</title>
      </Helmet>
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-gray-800">
            Get In Touch
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            We'd love to hear from you. Reach out with any questions or
            inquiries.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Form */}
          <motion.div
            className="bg-white p-8 rounded-lg shadow-lg"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
            <form onSubmit={submitHandler} className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-3 border rounded-md"
              />
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border rounded-md"
              />
              <input
                type="text"
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="w-full p-3 border rounded-md"
              />
              <textarea
                placeholder="Your Message"
                rows="5"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="w-full p-3 border rounded-md"
              ></textarea>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#333333] text-white py-3 rounded-md hover:bg-black transition flex justify-center items-center"
              >
                {loading ? (
                  <ClipLoader size={20} color="#fff" />
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          </motion.div>
          {/* Contact Info */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-start">
              <FaMapMarkerAlt className="text-3xl text-[#BFA181] mt-1 mr-4" />
              <div>
                <h3 className="text-xl font-semibold">Our Address</h3>
                <p className="text-gray-600">
                  123 Artisan Lane, Pune, Maharashtra, 411001, India
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <FaEnvelope className="text-3xl text-[#BFA181] mt-1 mr-4" />
              <div>
                <h3 className="text-xl font-semibold">Email Us</h3>
                <p className="text-gray-600">contact@brbartfusion.com</p>
              </div>
            </div>
            <div className="flex items-start">
              <FaPhone className="text-3xl text-[#BFA181] mt-1 mr-4" />
              <div>
                <h3 className="text-xl font-semibold">Call Us</h3>
                <p className="text-gray-600">+91 987 654 3210</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
