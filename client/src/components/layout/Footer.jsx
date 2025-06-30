import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import Logo from "../common/Logo";
import { useState } from "react";
import { toast } from "sonner";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the email to your backend or a service like Mailchimp
    console.log("Newsletter signup for:", email);
    toast.success("Thank you for subscribing to our newsletter!");
    setEmail("");
  };

  return (
    <footer className="bg-white text-text-secondary border-t-2 border-gray-200">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Column 1: Brand & Socials (larger on desktop) */}
          <div className="md:col-span-4 lg:col-span-3">
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

          {/* Spacer column on large screens */}
          <div className="hidden lg:block lg:col-span-1"></div>

          {/* Column 2: Quick Links */}
          <div className="md:col-span-4 lg:col-span-2">
            <h3 className="font-bold text-lg mb-4 text-text-primary">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/about"
                  className="hover:text-brand-accent transition"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-brand-accent transition">
                  Shop All
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-brand-accent transition"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="hover:text-brand-accent transition"
                >
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className="md:col-span-4 lg:col-span-2">
            <h3 className="font-bold text-lg mb-4 text-text-primary">
              Support
            </h3>
            <ul className="space-y-3 text-sm">
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
              <li>
                <a href="#" className="hover:text-brand-accent transition">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter (Integrated) */}
          <div className="md:col-span-8 lg:col-span-4">
            <h3 className="font-bold text-lg mb-4 text-text-primary">
              Subscribe to Our Newsletter
            </h3>
            <p className="text-sm mb-4">
              Get updates on new arrivals, special offers, and the art of brass.
            </p>
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex w-full max-w-sm"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="p-3 rounded-l-md text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-accent w-full border border-gray-300"
              />
              <button
                type="submit"
                className="bg-brand-accent text-white px-6 rounded-r-md font-semibold hover:bg-opacity-90 transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="bg-gray-200 text-center py-4 text-gray-500 text-sm">
        <p>
          &copy; {new Date().getFullYear()} BRB Art Fusion. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
