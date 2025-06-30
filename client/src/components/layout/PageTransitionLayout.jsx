import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

const PageTransitionLayout = () => {
  const pageAnimation = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
    transition: { duration: 0.4 },
  };
  return (
    <motion.div
      initial={pageAnimation.initial}
      animate={pageAnimation.animate}
      exit={pageAnimation.exit}
      transition={pageAnimation.transition}
    >
      <Outlet />
    </motion.div>
  );
};

export default PageTransitionLayout;
