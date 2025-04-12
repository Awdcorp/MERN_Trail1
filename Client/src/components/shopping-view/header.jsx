import { useState } from "react";
import { Menu, X, Search, ShoppingCart, User, MapPin, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.jpg"; // Update this path to your logo

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    "Party Supplies",
    "Balloons",
    "Costumes",
    "Entertainment",
    "Party Rentals",
    "Customise Your Party",
  ];

  return (
    <header className="w-full">
      {/* Top Bar */}
      <div className="bg-[#00B0BA] text-white text-xs md:text-sm py-3 text-center">
  <div className="max-w-screen-xl mx-auto px-4 md:px-0">
    <div className="flex flex-col md:flex-row md:justify-between items-center gap-2">
      <span>10% OFF FIRST ORDER: USE CODE HELLOPW</span>
      <span>FREE DELIVERIES IN UAE ON ORDERS OVER AED 200</span>
    </div>
  </div>
</div>


      {/* Middle Section */}
      <div className="bg-white py-4 border-b border-[#C7C7C7] md:border-none">
        <div className="px-4 md:px-0 max-w-screen-xl mx-auto">
          {/* Mobile: Logo + Cart + Burger */}
          <div className="flex items-center justify-between md:hidden mb-3">
            <Link to="/" className="flex justify-center">
              <img src={logo} alt="PartyWorld Logo" className="h-10" />
            </Link>
            <div className="flex items-center gap-4">
              <ShoppingCart className="h-5 w-5 text-[#463970]" />
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
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <img src={logo} alt="PartyWorld Logo" className="h-15 max-w-[250px] object-contain" />
            </Link>

            {/* Search */}
            <div className="relative w-full max-w-[500px]">
              <input
                type="text"
                placeholder="Search..."
                className="w-full border border-gray-300 rounded-full pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00B0BA]"
              />
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-[#463970]" />
            </div>

            {/* Icons */}
            <div className="flex gap-6 items-center">
              <User className="h-5 w-5 text-[#463970]" />
              <ShoppingCart className="h-5 w-5 text-[#463970]" />
              <Heart className="h-5 w-5 text-[#463970]" />
              <MapPin className="h-5 w-5 text-[#463970]" />
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
      <div className={`bg-[#00B0BA] ${menuOpen ? 'block' : 'hidden'} md:block`}>
        <div className="max-w-screen-xl mx-auto px-4 md:px-0 py-5 text-white">
          {/* Desktop Nav */}
          <div className="hidden md:flex justify-center">
          <nav className="hidden md:flex gap-6 font-medium text-[14px] tracking-wide uppercase">
            {navLinks.map((name) => (
              <Link
                key={name}
                to="#"
                className="hover:text-white/80 transition duration-150"
              >
                {name}
              </Link>
            ))}
          </nav>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {menuOpen && (
          <div className="md:hidden fixed top-[115px] left-0 w-full bg-[#00B0BA] z-40 px-4 py-4 space-y-3 shadow-lg border-t border-white/40 rounded-b-lg">
            {navLinks.map((name) => (
              <Link
                key={name}
                to="#"
                className="block text-sm text-white font-medium text-center hover:text-white/90"
                onClick={() => setMenuOpen(false)}
              >
                {name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
