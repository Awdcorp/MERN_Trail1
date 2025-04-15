// File: Client/src/components/common/CategorySection.jsx

import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { categoryGroups } from "@/components/shopping-view/categoryslliderimages";
import "swiper/css";

export default function CategorySection({ groupName, isSlider = true }) {
  const categories = categoryGroups[groupName] || [];
  return (
    <div className="px-4 md:px-8 mt-10">
      <h2 className="text-2xl font-medium text-center mb-2 uppercase text-[#463970]">
      {groupName}
      </h2>
      <div className="w-[140px] h-[1.9px] bg-[#A3A3A399] mx-auto mb-10" />
 
       {isSlider ? (
         <Swiper
           modules={[Autoplay]}
           autoplay={{ delay: 2500, disableOnInteraction: false }}
           slidesPerView={2}
           breakpoints={{
             640: { slidesPerView: 3 },
             768: { slidesPerView: 4 },
             1024: { slidesPerView: 5 },
           }}
           spaceBetween={16}
           loop
           className="w-full"
         >
           {categories.map((category, index) => (
             <SwiperSlide key={index}>
               <CategoryCard category={category} />
             </SwiperSlide>
           ))}
         </Swiper>
       ) : (
         <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 justify-center items-center">
           {categories.slice(0, 4).map((category, index) => (
             <CategoryCard category={category} key={index} />
           ))}
         </div>
       )}
     </div>
   );
 }
 
 function CategoryCard({ category }) {
   return (
     <Link
       to={`/shop/category/${category.name.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and")}`}
       className="flex flex-col items-center justify-center"
     >
       <img
         src={category.image}
         alt={category.name}
         className="w-[280px] h-[280px] object-cover rounded-md mb-4"
       />
       <span
         className="text-sm text-center"
         style={{ color: "#463970", fontSize: "15px", fontWeight: 400 }}
       >
         {category.name}
       </span>
     </Link>
   );
 }

