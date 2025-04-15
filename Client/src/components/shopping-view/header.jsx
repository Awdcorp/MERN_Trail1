import { useState } from "react";
import {
  Menu,
  X,
  Search,
  ShoppingCart,
  User,
  MapPin,
  Heart,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.jpg";

const megaMenu = {
  "Party Supplies": {
    "Tableware": ["Cups", "Plates", "Napkins", "Cutlery", "Serveware", "Drinkware", "Food Picks", "Tablecovers"],
    "Decorations": ["Banners", "Confetti", "Garlands", "Centrepieces", "Scene Setters", "Door Decorations", "Hanging Decorations"],
    "Party Essentials": ["Wearables", "Cake / Cupcake Toppers", "Tattoos", "Yard Signs", "Horns And Blowers", "Pinatas", "Confetti Poppers", "Invitation Cards", "Candles"],
    "Party Packages": ["The Value Package", "The Value Plus Package", "The Entertainment Package", "The Premium Package", "The Superior Package", "The Deluxe Package", "The Ultimate Package", "SEE ALL"],
    "Party Favors And Gifts": ["Gifts", "Favor Bags", "Party Favors"],
    "Art & Craft Stationary & Games": ["Arts & Crafts", "Stationary", "Games & Toys"],
    "By Theme": ["All Themes"],
    "By Occasions": ["All Occasions"],
    "Age": ["Toddler", "Baby", "Child", "Teen", "Adult"],
  },
  Balloons: {
    "Birthdays": ["1st Birthday Balloons", "Adult Birthday Balloons", "Kids Birthday Balloons", "Teens Birthday Balloons", "Father's Birthday Balloons", "Mom's Birthday Balloons", "All Birthdays"],
    "Occasions": ["Birthday", "Anniversary", "Baby Shower", "Gender Reveal", "Bridal/Wedding", "Mother's Day", "Graduation", "Valentine's Day", "Ramadan/Eid", "UAE National Day", "Halloween", "New Year's", "Seasonal"],
    "Balloon Bouquets": ["Age Foil Balloon Bouquets", "Birthday Foil Balloon Bouquets", "Custom Age Balloon Bouquets", "Latex Balloon Bouquets", "Chrome Balloon Bouquets", "Printed Balloon Bouquets", "Foil Balloon Bouquets", "All Balloon Bouquets"],
    "Custom Text Balloons": ["Bubble Balloons With Mini", "Balloon Filling", "Bubble Balloons With Confetti Filling", "Colour Balloons With Custom Text", "All Balloons"],
    "Balloon Types": ["Balloon Banners", "Number Balloons", "Letter Balloons", "Latex Balloons", "Plain Foil Balloons", "Chrome Latex Balloons", "Metallic Latex Balloons", "Printed Latex Balloons", "Foil Balloons", "Air Balloons", "Latex Balloon Packets", "All Types"],
    Accessories: ["Balloon Tassels", "Weights", "Confettis", "Inflation Pumps", "Balloon Ribbons", "Balloon Stickers", "Balloon Cup & Sticks", "Double-Sided Stickers"],
    "Balloon Decorations": ["Balloon Arches", "Personalised Backdrops", "Balloon Pillars", "Hollow Letters", "Bedroom Decorations", "Welcome Board Balloons", "Balloons Sculptures", "Balloons Garlands", "Customised Decorations", "All Decorations"],
    "Shape & Size": ["Standard", "Supershape", "Jumbo", "Airwalker", "Orbz", "18 Inch", "24 Inch", "32 Inch", "38 Inch", "All Sizes"],
  },
  Costumes: {
    "Costume By Category": ["Animals", "Professions", "Cartoons Characters", "Superheroes", "Historical", "Sports", "TV And Movies", "Book Characters", "Warriors", "Princes & Princesses", "Retro", "All Categories"],
    "Costume Accessories": ["Armors & Weapons", "Bandanas", "Glasses/Eye Accessories", "Face Masks", "Fake Items", "Helmets", "Jewellery", "Nose & Ear Accessories", "Nails", "Tattoos", "Beards & Moustaches", "Wings", "All Accessories"],
    Halloween: ["Devils", "Ghosts", "Skeletons", "Vampires", "Zombies", "Witches & Wizards", "Pumpkins", "All Halloween"],
    "Costume By Age": ["Baby", "Toddler", "Child", "Adult", "All Ages"],
    "Costume By Gender": ["Male", "Female", "Unisex", "All Gender"],
  },
};

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  const navLinks = Object.keys(megaMenu).concat([
    "Entertainment",
    "Party Rentals",
    "Customise Your Party",
  ]);

  const formatSlug = (text) =>
    `/shop/category/${encodeURIComponent(
      text.toLowerCase().replace(/\s+/g, "-")
    )}`;

  return (
    <header className="w-full">
      {/* Top Bar */}
      <div className="bg-[#00B0BA] text-white text-xs md:text-sm py-3 text-center">
        <div className="max-w-screen-xl mx-auto px-4 md:px-0">
          <div className="flex flex-col md:flex-row font-normal md:justify-between items-center gap-2">
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
              className={`transition-transform ${
                activeMenu === name ? "rotate-180" : ""
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



      </div>
    </header>
  );
}
