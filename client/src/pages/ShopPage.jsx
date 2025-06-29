import { useState, useEffect } from "react";
import {
  useParams,
  Link,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import API from "../services/api";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import ReactPaginate from "react-paginate";
import SearchBox from "../components/common/SearchBox";
import ProductCard from "../components/products/ProductCard";
import { FaFilter, FaTimes } from "react-icons/fa";

const ShopPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { keyword, category } = useParams();

  // Read all params from URL search params for consistency
  const pageNumber = searchParams.get("page") || 1;
  const urlMinPrice = searchParams.get("minPrice") || "";
  const urlMaxPrice = searchParams.get("maxPrice") || "";

  const [data, setData] = useState({ products: [], page: 1, pages: 1 });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [minPrice, setMinPrice] = useState(urlMinPrice);
  const [maxPrice, setMaxPrice] = useState(urlMaxPrice);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = {
          keyword,
          pageNumber,
          category,
          minPrice: urlMinPrice,
          maxPrice: urlMaxPrice,
        };
        const { data: responseData } = await API.get(`/products`, { params });
        setData(responseData);
      } catch (error) {
        toast.error("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const { data } = await API.get("/products/categories");
        setCategories(data);
      } catch (error) {
        toast.error("Failed to load categories.");
      }
    };

    fetchProducts();
    fetchCategories();
  }, [keyword, pageNumber, category, searchParams]);

  const handlePageClick = (event) => {
    const newPage = event.selected + 1;
    const currentParams = new URLSearchParams(searchParams);
    currentParams.set("page", newPage);
    setSearchParams(currentParams);
    window.scrollTo(0, 0);
  };

  const handlePriceFilter = (e) => {
    e.preventDefault();
    const currentParams = new URLSearchParams(searchParams);

    if (minPrice) currentParams.set("minPrice", minPrice);
    else currentParams.delete("minPrice");

    if (maxPrice) currentParams.set("maxPrice", maxPrice);
    else currentParams.delete("maxPrice");

    currentParams.delete("page"); // Reset to page 1 when filter is applied
    setSearchParams(currentParams);
    setIsFilterOpen(false); // Close mobile filter view
  };

  const clearFilters = () => {
    setSearchParams({});
    setMinPrice("");
    setMaxPrice("");
    navigate("/shop");
  };

  const activeCategoryClass = "text-brand-accent font-bold";
  const categoryLinkClass =
    "hover:text-brand-accent transition-colors duration-200";

  return (
    <>
      <Helmet>
        <title>Shop Our Collection - BRB Art Fusion</title>
        <meta
          name="description"
          content="Explore our collection of handcrafted brass murtis, lanterns, and decorative items."
        />
      </Helmet>
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
          <h1 className="text-4xl font-bold">Our Collection</h1>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <SearchBox />
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="md:hidden p-3 border rounded-md text-text-primary"
            >
              <FaFilter />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filter Sidebar - Styled for new theme */}
          <aside
            className={`md:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit ${
              isFilterOpen ? "block" : "hidden"
            } md:block`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Filters</h2>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="md:hidden text-2xl"
              >
                <FaTimes />
              </button>
            </div>

            <div className="mb-6 border-b pb-6">
              <h3 className="font-bold text-lg mb-2">Price</h3>
              <form onSubmit={handlePriceFilter} className="space-y-2">
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
                  Apply
                </button>
              </form>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">Category</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/shop"
                    className={
                      !category ? activeCategoryClass : categoryLinkClass
                    }
                    onClick={clearFilters}
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
                    >
                      {cat}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <main className="md:col-span-3">
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <ClipLoader color="#BFA181" size={50} />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.products.length > 0 ? (
                    data.products.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))
                  ) : (
                    <p className="col-span-full text-center text-lg text-text-secondary">
                      No products found for your criteria.
                    </p>
                  )}
                </div>

                {data.pages > 1 && (
                  <div className="mt-12">
                    <ReactPaginate
                      nextLabel="Next >"
                      onPageChange={handlePageClick}
                      pageRangeDisplayed={3}
                      marginPagesDisplayed={2}
                      pageCount={data.pages}
                      forcePage={data.page - 1}
                      previousLabel="< Prev"
                      pageClassName="page-item"
                      pageLinkClassName="page-link"
                      previousClassName="page-item"
                      previousLinkClassName="page-link"
                      nextClassName="page-item"
                      nextLinkClassName="page-link"
                      breakLabel="..."
                      breakClassName="page-item"
                      breakLinkClassName="page-link"
                      containerClassName="pagination"
                      activeClassName="active"
                      renderOnZeroPageCount={null}
                    />
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default ShopPage;
