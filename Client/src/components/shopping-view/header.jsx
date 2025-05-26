import { useState, useEffect } from "react";
import { Menu, X, Search, ShoppingCart, User, MapPin, Heart, ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { getGuestId } from "@/lib/guest-id";
import UserCartWrapper from "./cart-wrapper";
import logo from "@/assets/logo.jpg";
import { createSelector } from "@reduxjs/toolkit";
import { Sheet } from "@/components/ui/sheet";
import axios from "axios";

const selectCartItemCount = createSelector(
  (state) => Array.isArray(state.shopCart.cartItems) ? state.shopCart.cartItems : [],
  (items) => items.reduce((total, item) => total + item.quantity, 0)
);

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [dynamicMenu, setDynamicMenu] = useState([]);
  const [navLinks, setNavLinks] = useState([]);
  const [megaMenu, setMegaMenu] = useState({});

  const dispatch = useDispatch();
  const cartCount = useSelector(selectCartItemCount);
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  useEffect(() => {
    const url = `${import.meta.env.VITE_API_URL}/api/admin/menus/header`;
    console.log("📡 Fetching menu from:", url);
    axios.get(url)
      .then((res) => {
        console.log("🔥 Menu response:", res.data);
        const items = res.data?.items || [];
        setDynamicMenu(items);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch menu:", err);
      });
  }, []);

  useEffect(() => {
    const links = [];
    const structured = {};
    dynamicMenu.forEach(item => {
      links.push(item.label);
      structured[item.label] = {};
      item.children?.forEach(child => {
        structured[item.label][child.label] = child.children?.map(sub => sub.label) || [];
      });
    });
    setNavLinks(links);
    setMegaMenu(structured);
    console.log("✅ Built navLinks:", links);
    console.log("✅ Built megaMenu:", structured);
  }, [dynamicMenu]);

  useEffect(() => {
    setMenuOpen(false);
    setActiveMenu(null);
  }, [location.pathname]);

  useEffect(() => {
    const guestId = user?.id ? null : getGuestId();
    dispatch(fetchCartItems(user?.id || guestId));
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchQuery.trim().length > 1) {
        axios
          .get(`${import.meta.env.VITE_API_URL}/api/products/search?query=${searchQuery}`)
          .then((res) => {
            if (res.data?.success) {
              setSearchResults(res.data.data || []);
            }
          })
          .catch(() => setSearchResults([]));
      } else {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [searchQuery]);

  const formatSlug = (text) => `/shop/category/${encodeURIComponent(text.toLowerCase().replace(/\s+/g, "-"))}`;

  return (
    <header className="w-full">
      <div className="bg-[#00B0BA] text-white text-xs md:text-sm py-3 text-center">
        <div className="max-w-screen-xl mx-auto px-4 md:px-0">
          <div className="flex flex-col md:flex-row font-normal md:justify-between items-center gap-2">
            <span>10% OFF FIRST ORDER: USE CODE HELLOPW</span>
            <span>FREE DELIVERIES IN UAE ON ORDERS OVER AED 200</span>
          </div>
        </div>
      </div>

      <div className="bg-white py-4 border-b border-[#C7C7C7] md:border-none">
        <div className="px-4 md:px-0 max-w-screen-xl mx-auto">
          <div className="flex items-center justify-between md:hidden mb-3">
            <Link to="/" className="flex justify-center">
              <img src={logo} alt="PartyWorld Logo" className="h-10" />
            </Link>
            <div className="flex items-center gap-4">
              <button onClick={() => setOpenCartSheet(true)} className="relative">
                <ShoppingCart className="h-5 w-5 text-[#463970]" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#EB6123] text-white text-[10px] font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
              <button onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? (
                  <X className="h-6 w-6 text-[#463970]" />
                ) : (
                  <Menu className="h-6 w-6 text-[#463970]" />
                )}
              </button>
            </div>
          </div>

          <div className="hidden md:flex justify-between items-center gap-8 mb-1">
            <Link to="/" className="flex-shrink-0">
              <img src={logo} alt="PartyWorld Logo" className="h-15 max-w-[250px] object-contain" />
            </Link>
            <div className="relative w-full max-w-[500px]">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-300 rounded-full pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00B0BA]"
              />
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-[#463970]" />
              {searchResults.length > 0 && (
                <ul className="absolute z-50 top-full left-0 w-full bg-white border rounded shadow text-sm mt-1 max-h-64 overflow-y-auto">
                  {searchResults.map((product) => (
                    <li key={product._id}>
                      <Link
                        to={`/shop/product/${product.slug || product._id}`}
                        className="block px-4 py-2 hover:bg-gray-100 text-black"
                        onClick={() => {
                          setSearchQuery("");
                          setSearchResults([]);
                        }}
                      >
                        {product.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex gap-6 items-center">
              {user ? (
                <Link to={user.role === "admin" ? "/admin/dashboard" : "/shop/account"}>
                  <User className="h-5 w-5 text-[#463970]" />
                </Link>
              ) : (
                <Link to="/auth/login">
                  <User className="h-5 w-5 text-[#463970]" />
                </Link>
              )}
              <button onClick={() => setOpenCartSheet(true)} className="relative">
                <ShoppingCart className="h-5 w-5 text-[#463970]" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#EB6123] text-white text-[10px] font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
              <Heart className="h-5 w-5 text-[#463970]" />
              <MapPin className="h-5 w-5 text-[#463970]" />
            </div>
          </div>

          <div className="relative w-full max-w-[600px] mx-auto md:hidden">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded-full pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00B0BA]"
            />
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-[#463970]" />
            {searchResults.length > 0 && (
              <ul className="absolute z-50 top-full left-0 w-full bg-white border rounded shadow text-sm mt-1 max-h-64 overflow-y-auto">
                {searchResults.map((product) => (
                  <li key={product._id}>
                    <Link
                      to={`/shop/product/${product.slug || product._id}`}
                      className="block px-4 py-2 hover:bg-gray-100 text-black"
                      onClick={() => {
                        setSearchQuery("");
                        setSearchResults([]);
                      }}
                    >
                      {product.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className={`bg-[#00B0BA] ${menuOpen ? 'block' : 'hidden'} md:block`}>
        <div className="relative w-full text-white"> {/* <-- FULL SCREEN WRAPPER */}
          <div className="py-5">
            {/* Desktop Nav */}
            <div className="hidden md:flex justify-center relative">
              <nav className="flex justify-center gap-6 font-medium text-[14px] tracking-wide uppercase w-full">
                {navLinks.map((name) => (
                  <div
                    key={name}
                    className=""
                    onMouseEnter={() => setActiveMenu(name)}
                    onMouseLeave={() => setActiveMenu(null)}
                  >
                    <div> {/* <-- Important: this wraps the nav item */}
                      <Link
                        to={formatSlug(name)}
                        className="hover:text-white/80 transition duration-150 flex items-center gap-1"
                      >
                        {name}
                        {megaMenu[name] && <ChevronDown size={14} />}
                      </Link>
                    </div>
                    {/* Mega Menu */}
                    {activeMenu === name && megaMenu[name] && (
                      <div className="absolute left-0 right-0 top-full z-50">
                        {/* 👇 Invisible buffer zone */}
                        <div className="h-4 w-full" />

                        <div className="bg-white shadow-xl max-w-screen-2xl mx-auto px-12 py-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10">
                          {/* Mega Menu Items */}

                          {Object.entries(megaMenu[name]).map(([category, items]) => (
                            <div key={category}>
                              <Link
                                to={`/${category.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`}
                                className="block text-[13px] font-bold text-[#463970] uppercase mb-2 tracking-wide hover:text-[#00B0BA] transition"
                              >
                                {category}
                              </Link>
                              <ul className="space-y-1 text-sm text-[#463970] normal-case">
                                {items.map((item) => (
                                  <li key={item}>
                                    <Link
                                      to={formatSlug(item)}
                                      className="hover:text-[#00B0BA] transition"
                                    >
                                      {item}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                ))}
              </nav>
            </div>
          </div>
        </div>
        {/* Mobile Nav Dropdown */}
        {menuOpen && (
          <div className="md:hidden fixed top-[115px] left-0 w-full bg-white z-40 px-4 py-4 shadow-lg border-t border-white/40 overflow-y-auto max-h-[90vh]">
            {navLinks.map((name) => (
              <div key={name} className="mb-2 border-b border-gray-200">
                <button
                  onClick={() => setActiveMenu(activeMenu === name ? null : name)}
                  className="w-full text-sm text-left text-[#463970] font-medium uppercase tracking-wide px-4 py-3 bg-white hover:bg-gray-100 flex justify-between items-center"
                >
                  {name}
                  {megaMenu[name] && (
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${activeMenu === name ? "rotate-180" : ""
                        }`}
                    />
                  )}
                </button>

                {/* Submenu */}
                {activeMenu === name && megaMenu[name] && (
                  <div className="bg-white px-4 py-3">
                    {Object.entries(megaMenu[name]).map(([category, items]) => (
                      <div key={category} className="mb-3">
                        <Link
                          to={`/${category.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`}
                          className="block text-[13px] font-medium uppercase text-[#463970] mb-1 tracking-wide"
                          onClick={() => setMenuOpen(false)}
                        >
                          {category}
                        </Link>
                        <ul className="space-y-1 text-sm text-[#463970] ml-2">
                          {items.map((item) => (
                            <li key={item}>
                              <Link
                                to={formatSlug(item)}
                                className="block font-normal hover:text-[#00B0BA] transition"
                                onClick={() => setMenuOpen(false)}
                              >
                                {item}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
          <UserCartWrapper setOpenCartSheet={setOpenCartSheet} />
        </Sheet>
      </div>
    </header>
  );
}
