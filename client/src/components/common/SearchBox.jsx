import { FaSearch } from "react-icons/fa";

const SearchBox = ({ value, onChange }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // The live search happens automatically, but this prevents page reload
    // if the user hits Enter.
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full relative items-center">
      <input
        type="text"
        name="q"
        value={value}
        onChange={onChange}
        placeholder="Search products..."
        className="w-full p-2 pl-10 border rounded-md focus:ring-brand-accent focus:ring-2 focus:outline-none"
        aria-label="Search products"
      />
      {/* Search Icon inside the input field for better UI */}
      <FaSearch className="absolute left-3 text-gray-400 pointer-events-none" />
    </form>
  );
};

export default SearchBox;
