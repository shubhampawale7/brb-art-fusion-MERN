import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import ReactPaginate from "react-paginate";
import SearchBox from "../components/common/SearchBox"; // Import SearchBox

const ShopPage = () => {
  const { keyword, pageNumber } = useParams();
  const [data, setData] = useState({ products: [], page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data: responseData } = await API.get(`/products`, {
          params: { keyword, pageNumber },
        });
        setData(responseData);
      } catch (error) {
        toast.error("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [keyword, pageNumber]);

  const handlePageClick = (event) => {
    const newPageNumber = event.selected + 1;
    // We will need to update the URL here to trigger the useEffect
    // For now, this requires a router setup that can handle this,
    // which we will add next. Let's just log it for now.
    console.log(`User requested page number ${newPageNumber}`);
    // In a real app, you'd use navigate(`/page/${newPageNumber}`) or similar
  };

  return (
    <>
      <Helmet>
        <title>Shop - BRB Art Fusion</title>
        <meta
          name="description"
          content="Explore our collection of handcrafted brass murtis, lanterns, and decorative items."
        />
      </Helmet>
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Our Collection</h1>
          <SearchBox />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <ClipLoader color="#BFA181" size={50} />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {data.products.map((product) => (
                <Link key={product._id} to={`/product/${product._id}`}>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-4">
                      <h2 className="text-lg font-semibold truncate">
                        {product.name}
                      </h2>
                      <p className="text-xl text-[#BFA181] mt-2">
                        ₹{product.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <ReactPaginate
              nextLabel="next >"
              onPageChange={handlePageClick}
              pageRangeDisplayed={3}
              marginPagesDisplayed={2}
              pageCount={data.pages}
              previousLabel="< previous"
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
          </>
        )}
      </div>
    </>
  );
};

export default ShopPage;
