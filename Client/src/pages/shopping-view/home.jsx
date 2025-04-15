import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import bannerOne from "../../assets/banner-1.webp";
import bannerTwo from "../../assets/banner-2.webp";
import bannerThree from "../../assets/banner-3.webp";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { fetchAllFilteredProducts, fetchProductDetails } from "@/store/shop/products-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import OccasionCategorySection from "@/components/shopping-view/occasioncategorysection";
import CategorySection  from "@/components/shopping-view/occasioncategorysection";
import ProductSliderSection from "@/components/shopping-view/newarrivalsslider";
import HomepageSlider from "@/components/shopping-view/homepageslider";
import ThemeCategorySection from "@/components/shopping-view/themecategorysection";
import { PhoneCall } from "lucide-react";
 import { FaWhatsapp } from "react-icons/fa"; // <-- install this if not already

function ShoppingHome() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productList, productDetails } = useSelector((state) => state.shopProducts);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  const handleAddtoCart = (productId, stock) => {
    let currentItems = cartItems?.items || [];
    const foundIndex = currentItems.findIndex((item) => item.productId === productId);

    if (foundIndex > -1 && currentItems[foundIndex].quantity + 1 > stock) {
      toast({ title: `Only ${stock} items available`, variant: "destructive" });
      return;
    }

    dispatch(addToCart({ userId: user?.id, productId, quantity: 1 })).then((res) => {
      if (res?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({ title: "Added to cart!" });
      }
    });
  };

  const handleGetProductDetails = (id) => {
    dispatch(fetchProductDetails(id));
  };

  const occasions = [
    { name: "Birthday", image: "/placeholders/birthday.jpg", slug: "birthday" },
    { name: "Eid", image: "/placeholders/eid.jpg", slug: "eid" },
    { name: "Halloween", image: "/placeholders/halloween.jpg", slug: "halloween" },
    { name: "Graduation", image: "/placeholders/graduation.jpg", slug: "graduation" },
    { name: "Ramadan", image: "/placeholders/ramadan.jpg", slug: "ramadan" },
    { name: "Engagement", image: "/placeholders/engagement.jpg", slug: "engagement" },
    { name: "Gender Reveal", image: "/placeholders/gender-reveal.jpg", slug: "gender-reveal" },
  ];
  const costumeCategoryIds = useMemo(() => ["67f844b7f1275889ad3993b8"], []);

  return (
    <div className="pt-0 pb-6 md:pb-10 px-4 md:px-6 space-y-6 md:space-y-10">
   
       {/* 🖼️ Responsive Full-Width Occasion Banner Slider */}
       <div className="-mx-8">
         <HomepageSlider />
       </div>
       
      <ProductSliderSection
  title="NEW ARRIVALS"
  categoryIds={costumeCategoryIds} // ✅ useMemo ensures no repeated useEffect
  sortBy="price-lowtohigh"
/>

<CategorySection groupName="Shop by Occasion" isSlider={true} />

       <ThemeCategorySection title="SHOP BY THEME" limit={4} />

       <ProductSliderSection
         title="BESTSELLERS"
         categoryIds={["67f7c88f2a38a098e8934182", "67f8278bcd23acad75619f75"]}
         sortBy="price-lowtohigh"
       />
       <CategorySection groupName="Plan Your Birthday" isSlider={true} />
 
       <div className="px-4 md:px-8 mt-10">
   <h2 className="text-2xl font-medium text-center mb-2 uppercase text-[#463970]">
   Party PACKAGES
   </h2>
   <div className="w-[140px] h-[1.9px] bg-[#A3A3A399] mx-auto mb-10" />
 
   <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
   {[
   {
     name: "The Value Package",
     image: "https://partyworld.ae/wp-content/uploads/2025/03/children-celebrating-birthday-party-scaled-1.jpg",
     link: "the-value-package-2",
   },
   {
     name: "The Value Plus Package",
     image: "https://partyworld.ae/wp-content/uploads/2025/03/children-with-party-horns-celebrating-birthday-scaled-1.jpg",
     link: "the-value-plus-package-2",
   },
   {
     name: "The Premium Package",
     image: "https://partyworld.ae/wp-content/uploads/2025/03/group-happy-kids-with-colorful-candies-having-fun-birthday-party-isolated-white-scaled-1.jpg",
     link: "the-premium-package",
   },
   {
     name: "The Entertainment Package",
     image: "https://partyworld.ae/wp-content/uploads/2025/03/children-smiling-happiness-friendship-togetherness-celebration-studio-portrait-scaled-1.jpg",
     link: "the-entertainment-package",
   },
   {
     name: "The Superior Package",
     image: "https://partyworld.ae/wp-content/uploads/2025/03/children-holding-colorful-balloons-blowing-party-horn-during-birthday-scaled-1.jpg",
     link: "the-superior-package",
   },
   {
     name: "The Deluxe Package",
     image: "https://partyworld.ae/wp-content/uploads/2025/03/madness-birthday-party-scaled-1.jpg",
     link: "the-deluxe-package",
   },
   {
     name: "The Ultimate Package",
     image: "https://partyworld.ae/wp-content/uploads/2025/03/portrait-happy-friends-wearing-party-hat-standing-together-scaled-1.jpg",
     link: "the-ultimate-package",
   },
 ].map((item, idx) => (
   <a
     key={idx}
     href={`/shop/product/${item.link}`}
     className="flex flex-col items-center justify-center"
   >
     <img
       src={item.image}
       alt={item.name}
       className="w-full h-48 object-cover rounded-md mb-4"
     />
     <span
       className="text-sm text-center"
       style={{
         color: "#463970",
         fontSize: "15px",
         fontWeight: 400,
       }}
     >
       {item.name}
     </span>
   </a>
 ))}
 
   </div>
 </div>
 
 
   <div className="px-4 md:px-8 mt-10">
   <h2 className="text-2xl font-medium text-center mb-2 pt-5 uppercase text-[#463970]">
     Visit Our Stores
   </h2>
   <div className="w-[140px] h-[1.9px] bg-[#A3A3A399] mx-auto mb-10" />
 
   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
   {[
   {
    name: "AL BARSHA",
    address: "Iridium building, Umm Suqeim Road, Barsha, Dubai",
    color: "from-[#B7117A]",
    buttonColor: "#B7117A",
    mapSrc: "https://www.google.com/maps/embed?...",
  },
  {
    name: "THE SPRINGS SOUK",
    address: "The Springs Souk, Ground floor, Dubai",
    color: "from-[#00B0BA]",
    buttonColor: "#00B0BA",
    mapSrc: "https://www.google.com/maps/embed?...",
  },
  {
    name: "MOTORCITY",
    address: "Foxhill 9 building, Ground floor, Motor City, Dubai",
    color: "from-[#F18074]",
    buttonColor: "#F18074",
    mapSrc: "https://www.google.com/maps/embed?...",
  },
  {
    name: "ARABIAN RANCHES",
    address: "Arabian Ranches III Souk, Dubai",
    color: "from-[#B7117A]",
    buttonColor: "#B7117A",
    mapSrc: "https://www.google.com/maps/embed?...",
  },
].map((store, idx) => (
  <div
  key={idx}
  className="relative overflow-hidden rounded-xl shadow-md text-center text-[#2D2D2D]"
  >
     {/* Gradient bottom */}
     <div
       className={`absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t ${store.color} to-transparent z-0`}
     />
       <div className="relative z-10 p-4 flex flex-col items-center">
       {/* 🟣 Matching Color Tag */}
       <div
   className="text-white text-xs font-semibold tracking-widest uppercase h-10 w-44 flex items-center justify-center rounded-md mx-auto"
   style={{ backgroundColor: store.buttonColor }}
 >
   {store.name}
 </div>
 
 
       <h3 className="text-center text-[14px] font-medium leading-snug mb-1 pt-5 max-w-[80%] mx-auto px-2">
       {store.address}
 </h3>
       <div className="w-[100%] h-[1px] bg-black my-3" />
 
       <iframe
         src={store.mapSrc}
         width="100%"
         height="230"
         style={{ border: 0 }}
         allowFullScreen=""
         loading="lazy"
         referrerPolicy="no-referrer-when-downgrade"
         title={store.name}
         className="rounded-md"
       ></iframe>
     </div>
   </div>
 ))}
 
   </div>
 </div>
 
 
     <div className="px-4 pt-10 md:px-8 py-10 bg-white text-center">
       {/* Contact Info Row */}
       <div className="flex flex-col pt-10 md:flex-row justify-center items-center gap-10 md:gap-20 mb-10">
         {/* Phone */}
         <div className="flex items-center gap-3 text-xl text-[#2D2D2D]">
           <PhoneCall size={28} className="text-[#463970]" />
           <span>600572789</span>
         </div>
 
         {/* WhatsApp 1 */}
         <div className="flex items-center gap-3 text-xl text-[#2D2D2D]">
           <FaWhatsapp size={28} className="text-[#25D366]" />
           <span>0503735574</span>
         </div>
 
         {/* WhatsApp 2 */}
         <div className="flex items-center gap-3 text-xl text-[#2D2D2D]">
           <FaWhatsapp size={28} className="bg-[#463970] text-white p-1 rounded" />
           <span>0565577610</span>
         </div>
       </div>
 
       {/* Contact Us Button */}
       <button className="bg-[#463970] text-white px-6 py-2 rounded-full text-sm shadow-md hover:opacity-90 transition">
         Contact Us
       </button>
     </div>
 
 
 </div>
 
  );
}

export default ShoppingHome;
