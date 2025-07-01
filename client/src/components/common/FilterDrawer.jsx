import { Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

// Helper for collapsible sections
const FilterSection = ({ title, children }) => (
  <div className="border-b py-4">
    <h3 className="font-bold text-lg mb-3">{title}</h3>
    {children}
  </div>
);

const FilterDrawer = ({
  isOpen,
  onClose,
  categories,
  category,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  handlePriceFilter,
  clearFilters,
  sortBy,
  onSortChange,
}) => {
  const activeCategoryClass = "text-brand-accent font-bold";
  const categoryLinkClass =
    "hover:text-brand-accent transition-colors duration-200";

  // *** KEY CHANGE HERE ***
  // The 'value' for each option has been updated to match your backend controller.
  const sortOptions = [
    { value: "latest", label: "Newest Arrivals" }, // Was 'newest'
    { value: "price_asc", label: "Price: Low to High" }, // Was 'price-asc'
    { value: "price_desc", label: "Price: High to Low" }, // Was 'price-desc'
    { value: "toprated", label: "Avg. Customer Review" }, // Was 'rating'
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      ></div>

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-full max-w-sm bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-2xl font-bold font-serif">Filters & Sort</h2>
            <button
              onClick={onClose}
              className="text-2xl text-gray-500 hover:text-black"
            >
              <FaTimes />
            </button>
          </div>

          {/* Filters Body */}
          <div className="p-6 flex-grow overflow-y-auto">
            <FilterSection title="Sort By">
              <div className="flex flex-col items-start gap-3">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => onSortChange(option.value)}
                    className={`text-left transition-colors duration-200 ${
                      // Defaulting to 'latest' if the sort value is something else (like 'newest' from old URLs)
                      sortBy === option.value ||
                      (option.value === "latest" &&
                        !sortOptions.some((o) => o.value === sortBy))
                        ? "text-brand-accent font-bold"
                        : "hover:text-brand-accent"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </FilterSection>

            <FilterSection title="Price Range">
              <form onSubmit={handlePriceFilter} className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full p-2 border rounded-md focus:ring-brand-accent focus:ring-2 focus:outline-none"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full p-2 border rounded-md focus:ring-brand-accent focus:ring-2 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-brand-accent text-white py-2 rounded-md font-semibold hover:bg-opacity-90"
                >
                  Apply Price
                </button>
              </form>
            </FilterSection>

            <FilterSection title="Category">
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/shop"
                    className={
                      !category ? activeCategoryClass : categoryLinkClass
                    }
                    onClick={() => {
                      clearFilters();
                      onClose();
                    }}
                  >
                    All Products
                  </Link>
                </li>
                {categories.map((cat) => (
                  <li key={cat}>
                    <Link
                      to={`/shop/category/${cat}`}
                      className={
                        category === cat
                          ? activeCategoryClass
                          : categoryLinkClass
                      }
                      onClick={onClose}
                    >
                      {cat}
                    </Link>
                  </li>
                ))}
              </ul>
            </FilterSection>
          </div>

          {/* Footer */}
          <div className="p-4 border-t">
            <button
              onClick={() => {
                clearFilters();
                onClose();
              }}
              className="w-full text-center py-2 text-gray-600 font-semibold hover:text-brand-accent"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterDrawer;
