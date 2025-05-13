import { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import DemoProductTile from "@/components/shopping-view/demoProductTile";

export default function TopOffersSlider({ title, categoryIds = [], viewAllUrl = "#" }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!categoryIds.length) return;

    async function fetchProducts() {
      try {
        console.log("📦 Fetching products for category IDs:", categoryIds);

        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/products/get`, {
          params: {
            category: categoryIds.join(","),
            limit: 10,
            sortBy: "price-lowtohigh",
          },
        });

        setProducts(res.data.data || []);
        console.log(`✅ Loaded ${res.data.data?.length || 0} products for '${title}'`);
      } catch (err) {
        console.error("❌ Error fetching products for categoryIds:", categoryIds, err);
      }
    }

    fetchProducts();
  }, [JSON.stringify(categoryIds)]);

  const handleAddtoCart = (productId, stock) => {
    console.log("🛒 Add to cart clicked:", productId, "Stock:", stock);
    // integrate your cart logic here if needed
  };

  return (
    <div className="py-8 px-4 md:px-6 relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-semibold text-[#2D2D2D]">{title}</h2>
        <Link
          to={`/shop/category/${viewAllUrl}`}
          className="text-sm border border-[#54E060] px-4 py-1 rounded hover:bg-[#54E060] hover:text-white transition"
        >
          VIEW ALL
        </Link>
      </div>

      <Swiper
        spaceBetween={16}
        slidesPerView={2}
        navigation={{
          nextEl: ".custom-next",
          prevEl: ".custom-prev",
        }}
        breakpoints={{
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 6 },
        }}
        modules={[Navigation]}
      >
        {products.map((product) => (
          <SwiperSlide key={product._id}>
            <DemoProductTile product={product} handleAddtoCart={handleAddtoCart} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Arrows */}
      <div className="custom-prev absolute left-[-16px] top-[50%] transform -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center cursor-pointer">
        <span className="text-xl font-bold">‹</span>
      </div>
      <div className="custom-next absolute right-[-16px] top-[50%] transform -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center cursor-pointer">
        <span className="text-xl font-bold">›</span>
      </div>
    </div>
  );
}