import React from "react";
import {
  Truck,
   ShoppingBag,
   Eye,
   DollarSign,
   Star,
   Facebook,
   Instagram,
   Mail,
   Music,
 } from "lucide-react";
 import { Link } from "react-router-dom";
 import logofooter from "@/assets/logo-footer.png";
 import MastercardIcon from "@/assets/mastercard.svg";
 import VisaIcon from "@/assets/visa.svg";
 import ApplePayIcon from "@/assets/applepay.svg";

 export default function Footer() {
  return (
    <footer className="bg-white text-[#2D2D2D]">
          {/* Support Info Section */}
          <div className="bg-gray-100 text-[#2D2D2D] py-8 px-4 sm:px-8 md:px-16 border-t border-b border-gray-200">
            <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
              {/* Left Side: Headings */}
              <div className="flex-1 space-y-2">
                <h2 className="text-xl font-semibold">We're Always Here To Help</h2>
                <p className="text-sm text-gray-600">
                  Reach out to us through any of these support channels
                </p>
              </div>

              {/* Right Side: Email and Phone */}
              <div className="flex flex-col sm:flex-row gap-8 text-sm w-full md:w-auto">
                {/* Email */}
                <div>
                  <p className="font-semibold">Email Support</p>
                  <a href="mailto:info@alrahmaniamobile.com" className="text-[#2D2D2D] hover:underline">
                    info@alrahmaniamobile.com
                  </a>
                </div>
                {/* Phone */}
                <div>
                  <p className="font-semibold">Phone Support</p>
                  <p>+971 56 747 4593</p>
                  <p>+971 56 907 4775</p>
                </div>
              </div>
            </div>
          </div>

       {/* Main Footer Content */}
       <div className="bg-white">
         <div className="max-w-screen-xl mx-auto px-4 py-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 text-sm text-[#2D2D2D]">
            {/* PHONES & TABLETS */}
            <div>
              <h4 className="font-semibold text-[#1f2937] mb-2">PHONES & TABLETS</h4>
              <ul className="space-y-1">
                <li><Link to="/shop/category/phone">Phones</Link></li>
                <li><Link to="/shop/category/samsung-phones">Samsung Phones</Link></li>
                <li><Link to="/shop/category/xiaomi">Xiaomi Phones</Link></li>
                <li><Link to="/shop/category/oppo">Oppo Phones</Link></li>
                <li><Link to="/shop/category/tablets">Tablets</Link></li>
                <li><Link to="/shop/category/samsung-tablets">Samsung Tablets</Link></li>
              </ul>
            </div>

            {/* ACCESSORIES */}
            <div>
              <h4 className="font-semibold text-[#1f2937] mb-2">ACCESSORIES</h4>
              <ul className="space-y-1">
                <li><Link to="/shop/category/accessories">All Accessories</Link></li>
                <li><Link to="/shop/category/apple-accessories">Apple</Link></li>
                <li><Link to="/shop/category/samsung-accessories">Samsung</Link></li>
                <li><Link to="/shop/category/xiaomi-accessories">Xiaomi</Link></li>
                <li><Link to="/shop/category/anker-accessories">Anker</Link></li>
                <li><Link to="/shop/category/promate-accessories">Promate</Link></li>
              </ul>
            </div>

            {/* AUDIO & POWER */}
            <div>
              <h4 className="font-semibold text-[#1f2937] mb-2">AUDIO & POWER</h4>
              <ul className="space-y-1">
                <li><Link to="/shop/category/earphones">Earphones</Link></li>
                <li><Link to="/shop/category/powerbank">Powerbanks</Link></li>
                <li><Link to="/shop/category/samsung-accessories">Cables & Chargers</Link></li>
              </ul>
            </div>

            {/* WATCHES */}
            <div>
              <h4 className="font-semibold text-[#1f2937] mb-2">WATCHES</h4>
              <ul className="space-y-1">
                <li><Link to="/shop/category/watches">All Watches</Link></li>
                <li><Link to="/shop/category/samsung-watches">Samsung Watches</Link></li>
                <li><Link to="/shop/category/apple-watches">Apple Watches</Link></li>
              </ul>
            </div>

            {/* QUICK LINKS */}
            <div>
              <h4 className="font-semibold text-[#1f2937] mb-2">QUICK LINKS</h4>
              <ul className="space-y-1">
                <li><Link to="/shop/contact">Contact Us</Link></li>
                <li><Link to="/account">My Account</Link></li>
                <li><Link to="/returns">Shipping & Returns</Link></li>
                <li><Link to="terms">Subscription Terms</Link></li>
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/faq">FAQs</Link></li>
              </ul>
            </div>
           {/* Logo & Social */}
                      {/* CATEGORY */}
            <div>
              <h4 className="font-semibold text-[#1f2937] mb-2">CONNECT WITH US</h4>
                  <div className="flex gap-6 items-center">
                {/* Email Icon + Link */}
                <a
                  href="https://www.facebook.com/"
                  className="text-gray-600 hover:text-[#00B0BA] transition"
                  title="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="mailto:info@example.com"
                  className="text-gray-600 hover:text-[#00B0BA] transition"
                  title="Email Us"
                >
                  <Mail className="w-5 h-5" />
                </a>
                {/* Instagram Icon + Link */}
                <a
                  href="https://instagram.com/yourprofile"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-[#00B0BA] transition"
                  title="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
         </div>
       </div>
 
       {/* Bottom Bar */}
      <div className="bg-gray-100 text-white py-4">
          <p className="whitespace-nowrap items-center text-[#1f2937] text-center text-xs sm:text-sm font-normal">
            © 2021 ARM. All Rights Reserved.
          </p>
      </div>
         </footer>
   );
 }
