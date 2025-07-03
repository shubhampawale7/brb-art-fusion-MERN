import { FiSearch } from "react-icons/fi"; // Using Feather Icons for consistency

const SearchBox = ({ value, onChange, placeholder = "Search products..." }) => {
  // Added default placeholder prop
  const handleSubmit = (e) => {
    e.preventDefault();
    // The live search (debounce) happens automatically via onChange.
    // This just prevents a full page reload if the user hits Enter.
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full relative items-center">
      <input
        type="text"
        name="q"
        value={value}
        onChange={onChange}
        placeholder={placeholder} // Use the placeholder prop
        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-brb-primary focus:border-brb-primary transition-all duration-200 text-base md:text-lg" /* Enhanced styling */
        aria-label="Search products"
      />
      {/* Search Icon inside the input field for better UI */}
      <FiSearch className="absolute left-4 text-gray-500 text-xl pointer-events-none" />{" "}
      {/* Larger, darker icon */}
    </form>
  );
};

export default SearchBox;
