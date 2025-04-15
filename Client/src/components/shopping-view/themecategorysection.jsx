import { Link } from "react-router-dom";
 import { categoryGroups } from "@/components/shopping-view/categoryslliderimages";
 
 export default function CategoryGridSection({ title, limit }) {
   const categories = categoryGroups[title] || [];
   const visibleCategories = limit ? categories.slice(0, limit) : categories;
 
   return (
     <div className="px-4 md:px-8 mt-10">
       <h2 className="text-2xl font-medium text-center mb-2 uppercase text-[#463970]">
         {title}
       </h2>
       <div className="w-[140px] h-[1.9px] bg-[#A3A3A399] mx-auto mb-10" />
 
       <div
   className={`grid gap-6`}
   style={{
     gridTemplateColumns: `repeat(${visibleCategories.length}, minmax(0, 1fr))`,
   }}
 >
 
         {visibleCategories.map((category, index) => (
           <Link
             key={index}
             to={`/shop/category/${category.name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`}
             className="flex flex-col items-center justify-center"
           >
             <img
               src={category.image}
               alt={category.name}
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
               {category.name}
             </span>
           </Link>
         ))}
       </div>
     </div>
   );
 }