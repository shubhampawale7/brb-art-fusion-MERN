import { Link } from "react-router-dom";

const ShopByCategory = () => {
  const categoryItemStyle =
    "relative overflow-hidden rounded-lg shadow-lg group";
  const categoryOverlayStyle =
    "absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center";
  const categoryTextStyle = "text-white text-2xl font-bold font-serif";

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold">Shop by Category</h2>
          <p className="text-lg text-text-secondary mt-2 max-w-2xl mx-auto">
            From divine idols that bless your home to ornate lanterns that cast
            a warm glow, discover timeless treasures crafted with passion.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link to="/shop/category/Brass Murtis" className={categoryItemStyle}>
            <img
              src="https://images.unsplash.com/photo-1617347398863-2a366a75a7b8?q=80"
              alt="Brass Murtis"
              className="w-full h-80 object-cover transform group-hover:scale-110 transition-transform duration-500"
            />
            <div className={categoryOverlayStyle}>
              <h3 className={categoryTextStyle}>Brass Murtis</h3>
            </div>
          </Link>
          <Link to="/shop/category/Lanterns" className={categoryItemStyle}>
            <img
              src="https://images.unsplash.com/photo-1567082424799-a8647e335e44?q=80"
              alt="Lanterns"
              className="w-full h-80 object-cover transform group-hover:scale-110 transition-transform duration-500"
            />
            <div className={categoryOverlayStyle}>
              <h3 className={categoryTextStyle}>Lanterns</h3>
            </div>
          </Link>
          <Link
            to="/shop/category/Decorative Items"
            className={categoryItemStyle}
          >
            <img
              src="https://images.unsplash.com/photo-1581750242215-37655859e3b9?q=80"
              alt="Decorative Items"
              className="w-full h-80 object-cover transform group-hover:scale-110 transition-transform duration-500"
            />
            <div className={categoryOverlayStyle}>
              <h3 className={categoryTextStyle}>Decorative Items</h3>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;
