import { Route, Routes, useLocation } from "react-router-dom";
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import AdminLayout from "./components/admin-view/layout";
import AdminDashboard from "./pages/admin-view/dashboard";
import AdminProducts from "./pages/admin-view/products";
import AdminProductEdit from "./pages/admin-view/product-edit";
import AdminOrders from "./pages/admin-view/orders";
import AdminFeatures from "./pages/admin-view/features";
import AdminCategories from "./pages/admin-view/category";
import MediaDashboard from "./pages/admin-view/media";
import AdminUsers from "./pages/admin-view/users";
import AdminSEOSettingsPage from "./pages/admin-view/settings";
import BannerControlPage from "./pages/admin-view/banner-control";
import ShoppingLayout from "./components/shopping-view/layout";
import NotFound from "./pages/not-found";
import ShoppingHome from "./pages/shopping-view/home";
import ShoppingListing from "./pages/shopping-view/listing";
import ShoppingCheckout from "./pages/shopping-view/checkout";
import ShoppingAccount from "./pages/shopping-view/account";
import CheckAuth from "./components/common/check-auth";
import UnauthPage from "./pages/unauth-page";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/auth-slice";
import PaypalReturnPage from "./pages/shopping-view/paypal-return";
import PayPalCancelPage from "./pages/shopping-view/paypal-cancel";
import PaymentSuccessPage from "./pages/shopping-view/payment-success";
import SearchProducts from "./pages/shopping-view/search";
import CategoryListingPage from "@/pages/shopping-view/category";
import ProductPage from "@/pages/shopping-view/product";
import { fetchCartItems } from "./store/shop/cart-slice";
import ContactUs from "@/pages/shopping-view/ContactUs";
import TermsAndConditions from "@/pages/shopping-view/TermsAndConditions";

function App() {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const location = useLocation(); // ✅ Get current route

  useEffect(() => {
    dispatch(checkAuth()).then((res) => {
      const userId = res?.payload?.user?.id;
      const guestId = localStorage.getItem("guest_id");
  
      // 💡 Only fetch cart AFTER userId is known
      const cartId = userId || guestId;
      if (cartId) {
        console.log("🛒 [App.jsx] Post-auth cart fetch using:", cartId);
        dispatch(fetchCartItems(cartId));
      }
    });
  }, []);
  

  console.log(isLoading, user);

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        {/* ✅ Public Homepage */}
        <Route path="/" element={<ShoppingLayout />}>
          <Route index element={<ShoppingHome />} />
        </Route>

        {/* ✅ Auth routes */}
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>

        {/* 🔐 Admin Panel - Protected */}
        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="category" element={<AdminCategories />} />
          <Route path="products/:id" element={<AdminProductEdit />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="media" element={<MediaDashboard />} />
          <Route path="features" element={<AdminFeatures />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="settings" element={<AdminSEOSettingsPage />} />
          <Route path="banners" element={<BannerControlPage />} />
        </Route>

        {/* 🛍️ Shop Routes (Public + Protected) */}
        <Route path="/shop" element={<ShoppingLayout />}>
          {/* ✅ Public routes */}
          <Route path="home" element={<ShoppingHome />} />
          <Route path="category/:slug" element={<CategoryListingPage />} />
          <Route path="product/:slug" element={<ProductPage />} />
          <Route path="listing" element={<ShoppingListing />} />
          <Route path="search" element={<SearchProducts />} />
          <Route path="checkout" element={<ShoppingCheckout />} />
          <Route path="contact" element={<ContactUs />} />
<Route path="terms" element={<TermsAndConditions />} />
          <Route path="paypal-return" element={<PaypalReturnPage />} />
          <Route path="payment-success" element={<PaymentSuccessPage />} />
<Route path="paypal-cancel" element={<PayPalCancelPage />} />
          {/* 🔐 Authenticated route */}
          <Route
            path="account"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <ShoppingAccount />
              </CheckAuth>
            }
          />
        </Route>

        {/* 🚫 Unauthorized + Not Found */}
        <Route path="/unauth-page" element={<UnauthPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
