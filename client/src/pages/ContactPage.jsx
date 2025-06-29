import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaRegClock,
} from "react-icons/fa";
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

  return (
    <>
      <Helmet>
        <title>Contact Us - BRB Art Fusion</title>
        <meta
          name="description"
          content="Get in touch with BRB Art Fusion. We'd love to hear from you."
        />
      </Helmet>

      <div className="bg-page-bg">
        <div className="container mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold font-serif text-text-primary">
              Get In Touch
            </h1>
            <p className="text-lg text-text-secondary mt-2 max-w-2xl mx-auto">
              We'd love to hear from you. Reach out with any questions,
              comments, or inquiries.
            </p>
          </div>

          <div className="bg-card-bg p-8 rounded-lg shadow-xl grid md:grid-cols-2 gap-10">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-3xl font-bold font-serif mb-6 text-text-primary">
                Send us a Message
              </h2>
              <form onSubmit={submitHandler} className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full p-3 bg-page-bg border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-accent focus:outline-none transition"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-3 bg-page-bg border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-accent focus:outline-none transition"
                />
                <input
                  type="text"
                  placeholder="Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  className="w-full p-3 bg-page-bg border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-accent focus:outline-none transition"
                />
                <textarea
                  placeholder="Your Message"
                  rows="5"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="w-full p-3 bg-page-bg border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-accent focus:outline-none transition"
                ></textarea>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-accent text-white py-3 rounded-md hover:bg-opacity-90 transition flex justify-center items-center font-semibold text-lg"
                >
                  {loading ? (
                    <ClipLoader size={20} color="#fff" />
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            </motion.div>

            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="flex items-start">
                <FaMapMarkerAlt className="text-3xl text-brand-accent mt-1 mr-5" />
                <div>
                  <h3 className="text-xl font-serif font-bold text-text-primary">
                    Our Address
                  </h3>
                  <p className="text-text-secondary">
                    123 Artisan Lane, Pune, Maharashtra, 411001, India
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <FaEnvelope className="text-3xl text-brand-accent mt-1 mr-5" />
                <div>
                  <h3 className="text-xl font-serif font-bold text-text-primary">
                    Email Us
                  </h3>
                  <p className="text-text-secondary">
                    contact@brbartfusion.com
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <FaPhone className="text-3xl text-brand-accent mt-1 mr-5" />
                <div>
                  <h3 className="text-xl font-serif font-bold text-text-primary">
                    Call Us
                  </h3>
                  <p className="text-text-secondary">+91 987 654 3210</p>
                </div>
              </div>
              <div className="flex items-start">
                <FaRegClock className="text-3xl text-brand-accent mt-1 mr-5" />
                <div>
                  <h3 className="text-xl font-serif font-bold text-text-primary">
                    Business Hours
                  </h3>
                  <p className="text-text-secondary">
                    Monday - Saturday: 10:00 AM - 7:00 PM
                  </p>
                  <p className="text-text-secondary">
                    Sunday: By Appointment Only
                  </p>
                </div>
              </div>
              <div className="mt-6 h-64 rounded-lg overflow-hidden shadow-md">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d242117.7092628464!2d73.7228780772494!3d18.52460354452136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf2e67461101%3A0x828d43bf9d9ee343!2sPune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1678886565355!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
