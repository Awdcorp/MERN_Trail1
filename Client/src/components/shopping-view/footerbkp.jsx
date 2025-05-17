import React from "react";
import {
  Truck,
   ShoppingBag,
   Eye,
   DollarSign,
   Star,
   Facebook,
   Instagram,
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
      {/* Top Feature Bar */}
      <div
        className="bg-[#00B0BA] text-white text-[12px] sm:text-sm py-6 px-2 sm:px-6 md:px-12 flex md:grid md:grid-cols-5 md:gap-4 overflow-x-auto whitespace-nowrap"
        >
                  {[
           { icon: <Truck />, label: "Fast<br />Delivery" },
           { icon: <ShoppingBag />, label: "Free<br />Shipping" },
           { icon: <Eye />, label: "Secure<br />Payment" },
           { icon: <DollarSign />, label: "Cash On<br />Delivery" },
           { icon: <Star />, label: "Easy<br />Returns" },
         ].map((item, idx) => (
           <div
             key={idx}
             className="flex flex-col items-center justify-center text-center flex-1 min-w-[70px] md:min-w-0 md:px-2"
           >
             <div className="md:hidden">{React.cloneElement(item.icon, { size: 20 })}</div>
             <div className="hidden md:block">{React.cloneElement(item.icon, { size: 30 })}</div>
             <span className="mt-1 leading-tight hidden md:inline">
               {item.label.replace(/<br\s*\/?\>/g, " ")}
             </span>
             <span
               className="mt-1 leading-tight text-center md:hidden"
               dangerouslySetInnerHTML={{ __html: item.label }}
             />
           </div>
         ))}
       </div>
 
       {/* Main Footer Content */}
       <div className="w-full bg-white">
         <div className="max-w-screen-xl mx-auto px-4 py-10 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-6 text-sm text-[#2D2D2D]">
           {/* Logo & Social */}
           <div className="col-span-2 md:col-span-1 pb-5 md:pb-0 flex flex-col items-center md:items-start text-center md:text-left text-[#46396F] space-y-2">
             <img src={logofooter} alt="PartyWorld Logo" className="w-36 md:w-28 mb-1" />
             <div className="w-[50%] h-[1px] bg-[#46396F] mt-1" />
             <p className="text-base md:text-sm font-medium">@partyworld.ae</p>
             <div className="flex gap-4 mt-1">
               <a href="https://facebook.com" target="_blank" rel="noreferrer">
                 <div className="bg-[#46396F] text-white rounded-full p-3 md:p-2">
                   <Facebook size={16} />
                 </div>
               </a>
               <a href="https://instagram.com" target="_blank" rel="noreferrer">
                 <div className="bg-[#46396F] text-white rounded-full p-3 md:p-2">
                   <Instagram size={16} />
                 </div>
               </a>
               <a href="https://tiktok.com" target="_blank" rel="noreferrer">
                 <div className="bg-[#46396F] text-white rounded-full p-3 md:p-2">
                   <Music size={16} />
                 </div>
               </a>
             </div>
           </div>
 
           {/* Our Products - Link to category slugs */}
           <div>
             <h4 className="font-semibold text-[#46396F] mb-2">OUR PRODUCTS</h4>
             <ul className="space-y-1">
               <li><Link to="/shop/category/party-supplies">Party Supplies</Link></li>
               <li><Link to="/shop/category/balloons">Balloons</Link></li>
               <li><Link to="/shop/category/costumes">Costumes</Link></li>
               <li><Link to="/shop/category/entertainment">Entertainment</Link></li>
               <li><Link to="/shop/category/party-rentals">Party Rentals</Link></li>
               <li><Link to="/customisation">Customisation</Link></li>
             </ul>
           </div>
 
           {/* Quick Links - Static Pages */}
           <div>
             <h4 className="font-semibold text-[#46396F] mb-2">QUICK LINKS</h4>
             <ul className="space-y-1">
               <li><Link to="/account">My Account</Link></li>
               <li><Link to="/about">About Us</Link></li>
               <li><Link to="/contact">Contact Us</Link></li>
               <li><Link to="/careers">Join Our Team</Link></li>
               <li><Link to="/blog">Our Blog</Link></li>
             </ul>
           </div>
 
           {/* Policies - Static Pages */}
           <div>
             <h4 className="font-semibold text-[#46396F] mb-2">POLICIES</h4>
             <ul className="space-y-1">
               <li><Link to="/returns">Returns & Exchange</Link></li>
               <li><Link to="/delivery">Delivery</Link></li>
               <li><Link to="/privacy">Legal & Privacy</Link></li>
               <li><Link to="/terms">Terms & Conditions</Link></li>
               <li><Link to="/faq">FAQ</Link></li>
             </ul>
           </div>
                     {/* Newsletter */}
                     <div className="col-span-2 md:col-span-1">
             <p className="text-sm">
               Subscribe To Get Our FREE Party Checklist & Our Latest News And Offers
             </p>
           </div>
         </div>
       </div>
 
       {/* Bottom Bar */}
       <div className="bg-[#00B0BA] text-white py-4">
         <div className="max-w-screen-xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
           <p className="whitespace-nowrap text-center sm:text-left text-xs sm:text-sm font-normal">
             Copyright © {new Date().getFullYear()} Party World.
           </p>
           <div className="flex items-center gap-2 bg-white px-1 py-0 rounded-lg shadow-md">
             <div className="rounded-full px-1 flex items-center justify-center">
               <img src={MastercardIcon} alt="Mastercard" className="h-5 w-auto object-cover" />
               </div>
               <div className="rounded-full px-1 flex items-center justify-center">
               <img src={VisaIcon} alt="Visa" className="h-7 w-auto object-cover" />
             </div>
             <div className="rounded-full px-1 flex items-center justify-center">
             <img src={ApplePayIcon} alt="Apple Pay" className="h-8 w-auto object-cover" />
             </div>
           </div>
         </div>
         </div>
         </footer>
   );
 }
