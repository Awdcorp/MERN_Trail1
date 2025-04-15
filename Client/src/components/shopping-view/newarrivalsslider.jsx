import { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import ShoppingProductTile from "@/components/shopping-view/product-tile";

export default function ProductSliderSection({ title, categoryIds = [], sortBy = "date-newest", customProducts }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (customProducts) {
      setProducts(customProducts);
      return;
    }

    async function fetchProducts() {
      try {
        const params = {
          category: categoryIds?.join(','),
          sortBy,
          limit: 10,
        };

        console.log(`📦 [SLIDER] Fetching "${title}" products with:`, params);

        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/products/get`, { params });
        setProducts(res.data.data || []);
        console.log(`✅ [SLIDER] "${title}" fetched ${res.data.data?.length || 0} products`);
      } catch (err) {
        console.error(`❌ Failed to fetch products for ${title}`, err);
      }
    }

    fetchProducts();
  }, [customProducts, JSON.stringify(categoryIds), sortBy]); // ✅ deep comparison
  
  return (
    <div className="px-4 md:px-6 py-8">
      <h2 className="text-xl md:text-2xl font-medium text-center mb-2 uppercase text-[#463970]">
        {title}
      </h2>
      <div className="w-[140px] h-[1px] bg-[#A3A3A399] mx-auto mb-6" />

      <Swiper
        spaceBetween={12}
        slidesPerView={2}
        breakpoints={{
          480: { slidesPerView: 2 },
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 6 },
        }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        modules={[Autoplay]}
      >
        {products.map((product) => (
          <SwiperSlide key={product._id} className="pb-2">
            <ShoppingProductTile product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
