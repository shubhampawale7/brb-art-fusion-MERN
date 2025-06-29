import Slider from "react-slick";
import ProductCard from "../products/ProductCard";

const FeaturedProducts = ({ products }) => {
  const sliderSettings = {
    dots: true,
    infinite: products.length > 4,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section className="py-20 bg-page-bg">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold">Our Featured Works</h2>
          <p className="text-lg text-text-secondary mt-2 max-w-2xl mx-auto">
            A curated selection of our most beloved pieces, celebrated for their
            exceptional beauty and craftsmanship.
          </p>
        </div>
        {products && products.length > 0 ? (
          <Slider {...sliderSettings}>
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </Slider>
        ) : (
          <p className="text-center">Loading products...</p>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
