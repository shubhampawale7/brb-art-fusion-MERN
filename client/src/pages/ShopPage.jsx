import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import ReactPaginate from "react-paginate";
import SearchBox from "../components/common/SearchBox";
import ProductCard from "../components/products/ProductCard";
import { FaFilter } from "react-icons/fa";
import Modal from "../components/common/Modal";
import QuickView from "../components/products/QuickView";
import FilterDrawer from "../components/common/FilterDrawer"; // Import the new component

const ShopPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { category } = useParams();

  const pageNumber = searchParams.get("page") || 1;
  const urlMinPrice = searchParams.get("minPrice") || "";
  const urlMaxPrice = searchParams.get("maxPrice") || "";
  const urlKeyword = searchParams.get("keyword") || "";

  const [mainProductsData, setMainProductsData] = useState({
    products: [],
    page: 1,
    pages: 1,
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [minPrice, setMinPrice] = useState(urlMinPrice);
  const [maxPrice, setMaxPrice] = useState(urlMaxPrice);
  const [quickViewProductId, setQuickViewProductId] = useState(null);
  const [searchTerm, setSearchTerm] = useState(urlKeyword);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false); // State for the drawer

  // Debouncing effect for search
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentParams = new URLSearchParams(searchParams);
      if (searchTerm) {
        currentParams.set("keyword", searchTerm);
      } else {
        currentParams.delete("keyword");
      }
      currentParams.delete("page");
      setSearchParams(currentParams, { replace: true });
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, setSearchParams]);

  // Main data fetching effect
  useEffect(() => {
    const fetchAllShopData = async () => {
      setLoading(true);
      try {
        const params = {
          keyword: searchParams.get("keyword"),
          pageNumber,
          category,
          minPrice: searchParams.get("minPrice"),
          maxPrice: searchParams.get("maxPrice"),
        };
        const [mainRes, categoriesRes] = await Promise.all([
          API.get(`/products`, { params }),
          API.get("/products/categories"),
        ]);
        setMainProductsData(mainRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        toast.error(
          `Failed to load shop data: ${
            error.response?.data?.message || error.message
          }`
        );
      } finally {
        setLoading(false);
      }
    };
    fetchAllShopData();
  }, [category, pageNumber, searchParams]);

  const handlePageClick = (event) => {
    const newPage = event.selected + 1;
    const currentParams = new URLSearchParams(searchParams);
    currentParams.set("page", newPage.toString());
    const basePath = category ? `/shop/category/${category}` : "/shop";
    navigate(`${basePath}?${currentParams.toString()}`);
    window.scrollTo(0, 0);
  };

  const handlePriceFilter = (e) => {
    e.preventDefault();
    const currentParams = new URLSearchParams(searchParams);
    if (minPrice) currentParams.set("minPrice", minPrice);
    else currentParams.delete("minPrice");
    if (maxPrice) currentParams.set("maxPrice", maxPrice);
    else currentParams.delete("maxPrice");
    currentParams.delete("page");
    setSearchParams(currentParams);
    setIsFilterDrawerOpen(false); // Close drawer on apply
  };

  const clearFilters = () => {
    setSearchTerm("");
    setMinPrice("");
    setMaxPrice("");
    navigate("/shop");
  };

  return (
    <>
      <Helmet>
        <title>Shop Our Collection - BRB Art Fusion</title>
      </Helmet>

      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        categories={categories}
        category={category}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        handlePriceFilter={handlePriceFilter}
        clearFilters={clearFilters}
      />

      <div className="container mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-2">
            Shop Our Collection
          </h1>
          <p className="text-lg text-gray-600">
            {urlKeyword
              ? `Showing results for "${urlKeyword}"`
              : "Discover unique pieces of art"}
          </p>
        </div>

        {/* Controls: Search and Filter Button */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8 p-4 bg-gray-50 rounded-lg shadow-sm sticky top-20 z-10">
          <div className="w-full md:w-1/3">
            <SearchBox
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setIsFilterDrawerOpen(true)}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2 border-2 border-gray-300 rounded-md font-semibold hover:bg-gray-200 hover:border-gray-400 transition-colors"
          >
            <FaFilter />
            <span>Filters</span>
          </button>
        </div>

        {/* Main Product Grid */}
        <main>
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <ClipLoader color="#BFA181" size={50} />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {mainProductsData.products.length > 0 ? (
                  mainProductsData.products.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      onQuickViewClick={() =>
                        setQuickViewProductId(product._id)
                      }
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-16">
                    <h3 className="text-2xl font-semibold mb-2">
                      No Products Found
                    </h3>
                    <p className="text-gray-500">
                      Try adjusting your search or filters to find what you're
                      looking for.
                    </p>
                  </div>
                )}
              </div>
              {mainProductsData.pages > 1 && (
                <div className="mt-12">
                  <ReactPaginate
                    nextLabel="Next >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={3}
                    marginPagesDisplayed={2}
                    pageCount={mainProductsData.pages}
                    forcePage={mainProductsData.page - 1}
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

      <Modal
        isOpen={!!quickViewProductId}
        onClose={() => setQuickViewProductId(null)}
      >
        {quickViewProductId && <QuickView productId={quickViewProductId} />}
      </Modal>
    </>
  );
};

export default ShopPage;
