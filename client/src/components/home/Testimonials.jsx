import { motion } from "framer-motion";
import Slider from "react-slick";
import { FaStar, FaQuoteLeft } from "react-icons/fa";

const Testimonials = () => {
  // Slider settings for a single, auto-playing testimonial
  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 5000,
    cssEase: "ease-in-out",
  };

  const testimonials = [
    {
      name: "Priya S., Mumbai",
      text: "The brass murti I received is absolutely stunning. The craftsmanship is exceptional, and it has become the centerpiece of my home.",
      rating: 5,
    },
    {
      name: "Rohan K., Delhi",
      text: "Incredible quality and detail. The lantern casts a beautiful light and has transformed my living room. Highly recommended!",
      rating: 5,
    },
    {
      name: "Anika V., Bengaluru",
      text: "I was looking for authentic brassware and found BRB Art Fusion. The quality exceeded my expectations. A truly wonderful shopping experience.",
      rating: 5,
    },
  ];

  // IMPORTANT: Replace this with your own high-quality background image
  const backgroundImageUrl =
    "https://images.unsplash.com/photo-1593111883633-9d187c71a3a3?q=80&w=2940&auto=format&fit=crop";

  return (
    <motion.section
      className="relative py-20 sm:py-28 bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1 }}
    >
      {/* Dark Color Overlay for text readability */}
      <div className="absolute inset-0 bg-red-950 bg-opacity-70 backdrop-blur-sm"></div>

      <div className="relative container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-16 items-center">
          {/* Left Column: Title and decorative quote icon */}
          <div className="lg:col-span-1 text-center lg:text-left mb-12 lg:mb-0">
            <FaQuoteLeft className="text-white text-7xl opacity-10 mb-4 mx-auto lg:mx-0" />
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-white">
              Loved by Our Customers
            </h2>
          </div>

          {/* Right Column: The Testimonial Slider */}
          <div className="lg:col-span-2 testimonial-slider-container">
            <Slider {...settings}>
              {testimonials.map((item, index) => (
                <div key={index} className="px-4 text-center">
                  <div className="flex justify-center text-amber-400 mb-5 gap-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                  <p className="text-xl sm:text-2xl italic text-white/90 leading-relaxed font-serif">
                    "{item.text}"
                  </p>
                  <p className="mt-6 font-semibold text-lg text-white">
                    - {item.name}
                  </p>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Testimonials;
