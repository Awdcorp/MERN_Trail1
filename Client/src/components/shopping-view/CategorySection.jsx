import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { categoryGroups } from "@/components/shopping-view/categoryslliderimages";
import "swiper/css";

export default function CategorySection({ title, groupName, isSlider = true, limit = 7 }) {
  const categories = categoryGroups[groupName] || [];
  const visible = categories.slice(0, limit);

  const normalized = groupName?.toLowerCase() || "";
  const isThemeGrid = normalized.includes("theme");
  const isPartyPackage = normalized === "party packages";

  return (
    <div className="px-4 md:px-8 mt-10">
      <h2 className="text-2xl font-medium text-center mb-2 uppercase text-[#463970]">
        {title}
      </h2>
      <div className="w-[140px] h-[1.9px] bg-[#A3A3A399] mx-auto mb-10" />

      {isPartyPackage ? (
        // 7-column party package grid
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          {visible.map((item, idx) => (
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
              <span className="text-sm text-center text-[#463970]" style={{ fontSize: "15px", fontWeight: 400 }}>
                {item.name}
              </span>
            </a>
          ))}
        </div>
      ) : isThemeGrid ? (
        // Fixed 4-column theme block
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {visible.map((category, index) => (
            <ThemeCard key={index} category={category} />
          ))}
        </div>
      ) : isSlider ? (
        // Default slider layout
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
          {visible.map((category, index) => (
            <SwiperSlide key={index}>
              <GridCard category={category} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        // Default grid fallback
        <div
          className="grid gap-6"
          style={{
            gridTemplateColumns: `repeat(${visible.length}, minmax(0, 1fr))`,
          }}
        >
          {visible.map((category, index) => (
            <GridCard key={index} category={category} />
          ))}
        </div>
      )}
    </div>
  );
}

// Grid/Slider cards
function GridCard({ category }) {
  return (
    <Link
      to={`/shop/category/${category.name.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and")}`}
      className="flex flex-col items-center justify-center"
    >
      <img
        src={category.image}
        alt={category.name}
        className="w-full h-48 object-cover rounded-md mb-4"
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

// Theme grid card
function ThemeCard({ category }) {
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
