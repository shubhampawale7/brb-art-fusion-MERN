import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const Newsletter = () => (
  <div className="bg-brand-accent text-white">
    <div className="container mx-auto px-6 py-12">
      <div className="md:flex justify-between items-center text-center md:text-left">
        <div>
          <h2 className="text-3xl font-serif font-bold">
            Subscribe to Our Newsletter
          </h2>
          <p>
            Get updates on new arrivals, special offers, and the art of brass.
          </p>
        </div>
        <form className="mt-6 md:mt-0 flex">
          <input
            type="email"
            placeholder="Enter your email"
            className="p-3 rounded-l-md text-text-primary focus:outline-none w-full"
          />
          <button
            type="submit"
            className="bg-text-primary text-white px-6 rounded-r-md font-semibold hover:bg-opacity-80"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  </div>
);

const Footer = () => {
  return (
    <footer className="bg-text-primary text-page-bg">
      <Newsletter />
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Column 1: Brand */}
          <div>
            <h3 className="text-2xl font-serif font-bold text-brand-gold mb-4">
              BRB Art Fusion
            </h3>
            <p className="text-sm opacity-80">
              Timeless craftsmanship in brass, bringing heritage and elegance to
              your home.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="hover:text-white">
                <FaInstagram size={24} />
              </a>
              <a href="#" className="hover:text-white">
                <FaFacebook size={24} />
              </a>
              <a href="#" className="hover:text-white">
                <FaTwitter size={24} />
              </a>
            </div>
          </div>
          {/* ... Other columns remain structurally the same ... */}
        </div>
      </div>
      <div className="bg-black text-center py-4 text-gray-400 text-sm">
        <p>
          &copy; {new Date().getFullYear()} BRB Art Fusion. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
