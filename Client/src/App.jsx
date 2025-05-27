import { Route, Routes, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";

import AdminLayout from "./components/admin-view/layout";
import AdminDashboard from "./pages/admin-view/dashboard";
import AdminProducts from "./pages/admin-view/products";
import AdminProductEdit from "./pages/admin-view/product-edit";
import AdminOrders from "./pages/admin-view/orders";
import AdminFeatures from "./pages/admin-view/features";
import AdminHomepage from "./pages/admin-view/homepage";
import AdminCategories from "./pages/admin-view/category";
import MediaDashboard from "./pages/admin-view/media";
import AdminUsers from "./pages/admin-view/users";
import AdminPages from "./pages/admin-view/pages";
import AdminMenus from "./pages/admin-view/AdminMenus";
import AdminAnnouncement from "./pages/admin-view/AdminAnnouncement";
import PageBuilder from "@/pages/admin-view/page-builder";
import AdminImportHistory from "@/pages/admin-view/AdminImportExportHistory";
import AdminSEOSettingsPage from "./pages/admin-view/settings";
import BannerControlPage from "./pages/admin-view/banner-control";

import ShoppingLayout from "./components/shopping-view/layout";
import ShoppingHome from "./pages/shopping-view/home";
import ShoppingListing from "./pages/shopping-view/listing";
import ShoppingCheckout from "./pages/shopping-view/checkout";
import ShoppingAccount from "./pages/shopping-view/account";
import ContactUs from "@/pages/shopping-view/ContactUs";
import TermsAndConditions from "@/pages/shopping-view/TermsAndConditions";
import PaypalReturnPage from "./pages/shopping-view/paypal-return";
import PayPalCancelPage from "./pages/shopping-view/paypal-cancel";
import PaymentSuccessPage from "./pages/shopping-view/payment-success";
import SearchProducts from "./pages/shopping-view/search";
import CategoryListingPage from "@/pages/shopping-view/category";
import ProductPage from "@/pages/shopping-view/product";

import NotFound from "./pages/not-found";
import UnauthPage from "./pages/unauth-page";
import DynamicPage from "./pages/shopping-view/dynamic-page";

import CheckAuth from "./components/common/check-auth";
import { checkAuth } from "./store/auth-slice";
import { fetchCartItems } from "./store/shop/cart-slice";

function App() {
  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(checkAuth()).then((res) => {
      const userId = res?.payload?.user?.id;
      const guestId = localStorage.getItem("guest_id");
      const cartId = userId || guestId;
      if (cartId) {
        console.log("🛒 [App.jsx] Post-auth cart fetch using:", cartId);
        dispatch(fetchCartItems(cartId));
      }
    });
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col overflow-hidden bg-white">
        <Routes>
          {/* ✅ Public Homepage */}
          <Route path="/" element={<ShoppingLayout />}>
            <Route index element={<ShoppingHome />} />
          </Route>

          {/* ✅ Auth Routes */}
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

          {/* 🔐 Admin Panel – Standard layout */}
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
            <Route path="pages" element={<AdminPages />} />
            <Route path="settings" element={<AdminSEOSettingsPage />} />
            <Route path="homepage" element={<AdminHomepage />} />
            <Route path="banners" element={<BannerControlPage />} />
            <Route path="AdminImportHistory" element={<AdminImportHistory />} />
            <Route path="announcement" element={<AdminAnnouncement />} />
            <Route path="menus" element={<AdminMenus />} />
          </Route>

          {/* ✅ Fullscreen Page Builder – outside /admin layout */}
          <Route
            path="/admin/page-builder"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <AdminLayout fullscreen={true}>
                  <PageBuilder />
                </AdminLayout>
              </CheckAuth>
            }
          />

          {/* 🛍️ Shop Routes */}
          <Route path="/shop" element={<ShoppingLayout />}>
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
            <Route
              path="account"
              element={
                <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                  <ShoppingAccount />
                </CheckAuth>
              }
            />
          </Route>

          {/* 🚫 Fallback Routes */}
          <Route path="/unauth-page" element={<UnauthPage />} />
          <Route path="/pages/:slug" element={<DynamicPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </DndProvider>
  );
}

export default App;
