import { useContext } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "sonner";
import { ParallaxProvider } from "react-scroll-parallax";
import { AnimatePresence } from "framer-motion";

// Providers
import { AuthProvider } from "./context/AuthContext";
import { CartProvider, CartContext } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

// Layout Components
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AdminLayout from "./components/layout/AdminLayout";
import CartDrawer from "./components/cart/CartDrawer";
import ScrollToTop from "./components/common/ScrollToTop";
import PageTransitionLayout from "./components/layout/PageTransitionLayout";

// Route Guards
import PrivateRoute from "./components/common/PrivateRoute";
import AdminRoute from "./components/common/AdminRoute";

// All Page Components
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import ContactPage from "./pages/ContactPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ShippingPage from "./pages/ShippingPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import PlaceOrderPage from "./pages/PlaceOrderPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import ProfilePage from "./pages/ProfilePage";
import FavoritesPage from "./pages/FavoritesPage";
import BlogPage from "./pages/BlogPage";
import ArticleDetailPage from "./pages/ArticleDetailPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import ProductListPage from "./pages/admin/ProductListPage";
import ProductEditPage from "./pages/admin/ProductEditPage";
import OrderListPage from "./pages/admin/OrderListPage";
import UserListPage from "./pages/admin/UserListPage";
import PaymentPage from "./pages/PaymentPage";
import OrderDetailPageAdmin from "./pages/admin/OrderDetailPageAdmin";
import OurStoryPage from "./pages/OurStoryPage";

function App() {
  const { state, dispatch } = useContext(CartContext);
  const { isCartOpen } = state;
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-page-bg text-text-primary">
      <ScrollToTop />
      <Toaster position="top-center" richColors />
      <Navbar />
      <main className="flex-grow">
        {/* AnimatePresence allows components to animate when they are removed from the tree */}
        <AnimatePresence mode="wait">
          {/* We pass location and a key to Routes so AnimatePresence can track page changes */}
          <Routes location={location} key={location.pathname}>
            {/* Public and User routes are wrapped in the transition layout */}
            <Route element={<PageTransitionLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/product/:id" element={<ProductDetailsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/our-story" element={<OurStoryPage />} />
              <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
              <Route
                path="/resetpassword/:resettoken"
                element={<ResetPasswordPage />}
              />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<ArticleDetailPage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/shop/category/:category" element={<ShopPage />} />
              <Route path="/shop/page/:pageNumber" element={<ShopPage />} />
              <Route path="/shop/search/:keyword" element={<ShopPage />} />
              <Route
                path="/shop/search/:keyword/page/:pageNumber"
                element={<ShopPage />}
              />
              <Route
                path="/shop/category/:category/page/:pageNumber"
                element={<ShopPage />}
              />

              <Route path="" element={<PrivateRoute />}>
                <Route path="/shipping" element={<ShippingPage />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/placeorder" element={<PlaceOrderPage />} />
                <Route path="/profile" element={<ProfilePage />} />

                <Route path="/order/:id" element={<OrderDetailPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
              </Route>
            </Route>

            {/* Admin routes use their own layout and do not need the same page transition */}
            <Route path="/admin" element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="productlist" element={<ProductListPage />} />
                <Route path="orderlist" element={<OrderListPage />} />
                <Route path="userlist" element={<UserListPage />} />
                <Route path="product/:id/edit" element={<ProductEditPage />} />
                <Route path="order/:id" element={<OrderDetailPageAdmin />} />
              </Route>
            </Route>
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => dispatch({ type: "CLOSE_CART" })}
      />
    </div>
  );
}

export default App;
