import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Change window.scrollTo(0, 0) to this:
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", // This enables the smooth scrolling animation
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
