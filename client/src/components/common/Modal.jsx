import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi"; // Using Feather Icons for consistency and modern look

const Modal = ({ isOpen, onClose, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4" // Increased z-index, added consistent page padding
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }} // Smoother fade transition
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-70" // Darker, more solid backdrop
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          ></motion.div>

          {/* Modal Content */}
          <motion.div
            className="relative bg-white rounded-xl shadow-2xl m-4 max-w-xl w-full sm:w-11/12 md:w-3/4 lg:max-w-xl overflow-hidden transform" // Larger max-width, more responsive, softer corners, stronger shadow
            initial={{ y: -20, opacity: 0, scale: 0.95 }} // Subtle scale-in animation
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }} // Spring animation for content
            role="dialog" // ARIA role for accessibility
            aria-modal="true" // ARIA modal for accessibility
            aria-labelledby="modal-title" // Link to a title inside children if possible
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors z-10 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-brb-primary" // Styled close button
              aria-label="Close modal" // Accessibility label
            >
              <FiX className="text-2xl" /> {/* Larger, modern close icon */}
            </button>
            <div className="p-6 sm:p-8 md:p-10">
              {" "}
              {/* Increased padding for content */}
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
