import { useState, useEffect } from "react";
import { Menu, X, Search, ShoppingCart, User, MapPin, Heart, ChevronDown, } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { getGuestId } from "@/lib/guest-id";
import UserCartWrapper from "./cart-wrapper";
import logo from "@/assets/logo.png";
import { createSelector } from "@reduxjs/toolkit";
import { Sheet } from "@/components/ui/sheet"; // Make sure this import exists
import { HEADER_MENU } from "@/config/headerMenu";
// ✅ Memoized selector
const selectCartItemCount = createSelector(
  (state) => Array.isArray(state.shopCart.cartItems) ? state.shopCart.cartItems : [],
  (items) => items.reduce((total, item) => total + item.quantity, 0)
);


export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [openCartSheet, setOpenCartSheet] = useState(false);

  const dispatch = useDispatch();
  const cartCount = useSelector(selectCartItemCount);
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    setActiveMenu(null);
  }, [location.pathname]);

  useEffect(() => {
    const guestId = user?.id ? null : getGuestId();
    dispatch(fetchCartItems(user?.id || guestId));
  }, []);

  const formatSlug = (text) =>
    `/shop/category/${encodeURIComponent(text.toLowerCase().replace(/\s+/g, "-"))}`;

  return (
    <header className="w-full">
      {/* Middle Section */}
      <div className="bg-[#54E060] py-2 border-b border-[#C7C7C7] md:border-none">
        <div className="px-4 md:px-0 max-w-screen-xl mx-auto">
          {/* Mobile: Logo + Cart + Burger */}
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

          {/* Desktop: Logo + Search + Icons */}
          <div className="hidden md:flex justify-between items-center gap-8 mb-1">
            <Link to="/" className="flex-shrink-0">
              <img src={logo} alt="PartyWorld Logo" className="h-15 max-w-[250px] object-contain" />
            </Link>

            {/* ✅ Updated Search Bar: WIDER, centered */}
            <div className="relative w-full max-w-3xl mx-auto">
              <input
                type="text"
                placeholder="Search..."
                className="w-full border border-gray-300 rounded-sm pl-4 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00B0BA] shadow-sm"
              />
              <Search className="absolute right-3 top-3 h-4 w-4 text-[#463970]" />
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
            </div>
          </div>

          {/* Mobile: Search below */}
          <div className="relative w-full max-w-[600px] mx-auto md:hidden">
            <input
              type="text"
              placeholder="Search..."
              className="w-full border border-gray-300 rounded-full pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00B0BA]"
            />
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-[#463970]" />
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      {/* Bottom Navigation */}
      <div className={`bg-[#EFF7F9] ${menuOpen ? 'block' : 'hidden'} md:block`}>
        <div className="relative w-full text-black">
          <div className="py-3">
            <div className="hidden md:flex justify-center relative">
              <nav className="flex justify-center gap-6 text-[13px] uppercase font-medium tracking-[0.08em] font-sans text-[#111827]">
                {HEADER_MENU.map(({ label, children }) => (
                  <div
                    key={label}
                    className="relative"
                    onMouseEnter={() => setActiveMenu(label)}
                    onMouseLeave={() => setActiveMenu(null)}
                  >
                    {/* Menu Heading */}
                    <Link
                      to={children.length ? `/shop/category/${children[0].slug}` : "/shop/account"}
                      className="hover:text-[#00B0BA] transition duration-150 flex items-center gap-1 uppercase tracking-wider"
                    >
                      {label}
                      {children.length > 0 && <ChevronDown size={14} />}
                    </Link>

                    {/* Submenu (with hover buffer zone) */}
                    {activeMenu === label && children.length > 0 && (
                      <div className="absolute top-full left-0 w-56 mt-2 z-50">
                        {/* 👇 Invisible bridge into the margin area */}
                        <div className="absolute -top-2 left-0 w-full h-2 bg-transparent" />

                        <div className="bg-white shadow-md rounded-md py-2">
                          {children.map(({ title, slug }) => (
                            <Link
                              key={slug}
                              to={`/shop/category/${slug}`}
                              className="block px-4 py-2 text-[13px] font-normal text-[#1f2937] hover:bg-[#f1f5f9] hover:text-[#00B0BA] transition whitespace-nowrap"
                            >
                              {title}
                            </Link>
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

        {/* Mobile Nav */}
        {menuOpen && (
          <div className="md:hidden fixed top-[115px] left-0 w-full bg-white z-40 px-4 py-4 shadow-lg border-t border-white/40 overflow-y-auto max-h-[90vh]">
            {HEADER_MENU.map(({ label, children }) => (
              <div key={label} className="mb-2 border-b border-gray-200">
                <button
                  onClick={() => setActiveMenu(activeMenu === label ? null : label)}
                  className="w-full text-sm text-left text-[#463970] font-medium uppercase tracking-wide px-4 py-3 bg-white hover:bg-gray-100 flex justify-between items-center"
                >
                  {label}
                  {children.length > 0 && (
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${activeMenu === label ? "rotate-180" : ""}`}
                    />
                  )}
                </button>

                {activeMenu === label && children.length > 0 && (
                  <div className="bg-white px-4 py-3">
                    {children.map(({ title, slug }) => (
                      <Link
                        key={slug}
                        to={`/shop/category/${slug}`}
                        className="block text-sm text-[#1f2937] mb-1 hover:text-[#00B0BA]"
                        onClick={() => setMenuOpen(false)}
                      >
                        {title}
                      </Link>
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
