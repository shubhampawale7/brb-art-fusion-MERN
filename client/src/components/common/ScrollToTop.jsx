import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  // Get the current location object from react-router-dom
  const { pathname } = useLocation();

  // useEffect hook to perform side effects after component renders
  useEffect(() => {
    // Scroll the window to the top-left corner
    // 'behavior: "smooth"' provides a smooth animation effect for scrolling
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname]); // Dependency array: runs effect whenever `pathname` changes

  // This component doesn't render any visible UI
  return null;
};

export default ScrollToTop;
