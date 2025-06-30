import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import Logo from "../common/Logo"; // <-- Import the new Logo component

const Newsletter = () => (
  <div className="bg-brand-accent text-white">
    <div className="container mx-auto px-6 py-12">
      <div className="md:flex justify-between items-center text-center md:text-left">
        <div>
          <h2 className="text-3xl font-serif font-bold">
            Subscribe to Our Newsletter
          </h2>
          <p className="opacity-90">
            Get updates on new arrivals, special offers, and the art of brass.
          </p>
        </div>
        <form className="mt-6 md:mt-0 flex w-full max-w-md mx-auto md:mx-0">
          <input
            type="email"
            placeholder="Enter your email"
            className="p-3 rounded-l-md text-text-primary focus:outline-none w-full"
          />
          <button
            type="submit"
            className="bg-text-primary text-white px-6 rounded-r-md font-semibold hover:bg-opacity-80 transition"
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
    <footer className="bg-page-bg text-text-secondary">
      <Newsletter />
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Brand */}
          <div className="md:col-span-2 lg:col-span-1">
            {/* The old h3 is replaced with the new Logo component */}
            <div className="mb-4">
              <Logo />
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Timeless craftsmanship in brass, bringing heritage and elegance to
              your home.
            </p>
            <div className="flex space-x-4 mt-6">
              <a
                href="#"
                aria-label="Instagram"
                className="hover:text-brand-accent transition"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="hover:text-brand-accent transition"
              >
                <FaFacebook size={24} />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="hover:text-brand-accent transition"
              >
                <FaTwitter size={24} />
              </a>
            </div>
          </div>

          {/* Column 2: Shop Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-text-primary">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/shop/category/Brass Murtis"
                  className="hover:text-brand-accent transition"
                >
                  Brass Murtis
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/category/Lanterns"
                  className="hover:text-brand-accent transition"
                >
                  Lanterns
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/category/Pooja Items"
                  className="hover:text-brand-accent transition"
                >
                  Pooja Items
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/category/Decorative Items"
                  className="hover:text-brand-accent transition"
                >
                  Decorative Items
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-text-primary">
              Support
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/contact"
                  className="hover:text-brand-accent transition"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-brand-accent transition">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-accent transition">
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-accent transition">
                  Returns & Exchanges
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-text-primary">
              Contact Us
            </h3>
            <address className="not-italic text-sm space-y-2">
              <p>Pune, Maharashtra, India</p>
              <p>contact@brbartfusion.com</p>
              <p>+91 987 654 3210</p>
            </address>
          </div>
        </div>
      </div>
      <div className="bg-gray-200 text-center py-4 text-gray-500 text-sm">
        <p>
          &copy; {new Date().getFullYear()} BRB Art Fusion. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
