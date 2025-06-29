import { motion } from "framer-motion";
import Slider from "react-slick";
import { FaStar } from "react-icons/fa";

const Testimonials = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
  };

  const testimonials = [
    {
      name: "Priya S., Mumbai",
      text: "The brass murti I received is absolutely stunning. The craftsmanship is exceptional, and it has become the centerpiece of my home.",
    },
    {
      name: "Rohan K., Delhi",
      text: "Incredible quality and detail. The lantern casts a beautiful light and has transformed my living room. Highly recommended!",
    },
  ];

  return (
    <motion.section
      className="py-20 bg-soft-gray"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">
          Loved by Our Customers
        </h2>
        <div className="max-w-3xl mx-auto text-center">
          <Slider {...settings}>
            {testimonials.map((item, index) => (
              <div key={index} className="px-4">
                <div className="flex justify-center text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
                <p className="text-xl italic text-gray-700 leading-relaxed">
                  "{item.text}"
                </p>
                <p className="mt-6 font-semibold text-lg">- {item.name}</p>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </motion.section>
  );
};

export default Testimonials;
