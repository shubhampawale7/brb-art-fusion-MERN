import { Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "sonner";
import { ParallaxProvider } from "react-scroll-parallax";

// Providers
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

// Layout Components
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AdminLayout from "./components/layout/AdminLayout";

// Route Guards
import PrivateRoute from "./components/common/PrivateRoute";
import AdminRoute from "./components/common/AdminRoute";

// Public Page Components
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

// Private User Page Components
import ShippingPage from "./pages/ShippingPage";
import PaymentPage from "./pages/PaymentPage";
import PlaceOrderPage from "./pages/PlaceOrderPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import ProfilePage from "./pages/ProfilePage";

// Admin Page Components
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import ProductListPage from "./pages/admin/ProductListPage";
import ProductEditPage from "./pages/admin/ProductEditPage";
import OrderListPage from "./pages/admin/OrderListPage";
import UserListPage from "./pages/admin/UserListPage";

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <CartProvider>
          <ParallaxProvider>
            <div className="flex flex-col min-h-screen bg-[#FDFDFD] text-[#333333]">
              <Toaster position="top-center" richColors />
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/page/:pageNumber" element={<ShopPage />} />
                  <Route path="/search/:keyword" element={<ShopPage />} />
                  <Route
                    path="/search/:keyword/page/:pageNumber"
                    element={<ShopPage />}
                  />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/product/:id" element={<ProductDetailsPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route
                    path="/forgotpassword"
                    element={<ForgotPasswordPage />}
                  />
                  <Route
                    path="/resetpassword/:resettoken"
                    element={<ResetPasswordPage />}
                  />

                  {/* Protected User Routes */}
                  <Route path="" element={<PrivateRoute />}>
                    <Route path="/shipping" element={<ShippingPage />} />
                    <Route path="/payment" element={<PaymentPage />} />
                    <Route path="/placeorder" element={<PlaceOrderPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/order/:id" element={<OrderDetailPage />} />
                  </Route>

                  {/* Protected Admin Routes */}
                  <Route path="/admin" element={<AdminRoute />}>
                    <Route element={<AdminLayout />}>
                      <Route
                        path="dashboard"
                        element={<AdminDashboardPage />}
                      />
                      <Route path="productlist" element={<ProductListPage />} />
                      <Route path="orderlist" element={<OrderListPage />} />
                      <Route path="userlist" element={<UserListPage />} />
                      <Route
                        path="product/:id/edit"
                        element={<ProductEditPage />}
                      />
                    </Route>
                  </Route>
                </Routes>
              </main>
              <Footer />
            </div>
          </ParallaxProvider>
        </CartProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
