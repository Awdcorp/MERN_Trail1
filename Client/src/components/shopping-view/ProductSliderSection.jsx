import { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import ShoppingProductTile from "@/components/shopping-view/product-tile";

export default function ProductSliderSection({
  title,
  categoryIds = [],
  sortBy = "date-newest",
  tag,
  limit,
  customProducts,
}) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (customProducts) {
      setProducts(customProducts);
      return;
    }

    async function fetchProducts() {
      try {
        const params = {
          category: categoryIds?.join(","),
          tag,
          sortBy,
          limit: Number(limit) || 8,
        };

        console.log(`📦 [SLIDER] Fetching "${title}" products with:`, params);

        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/products/get`, {
          params,
        });
        setProducts(res.data.data || []);
        console.log(`✅ [SLIDER] "${title}" fetched ${res.data.data?.length || 0} products`);
      } catch (err) {
        console.error(`❌ Failed to fetch products for ${title}`, err);
      }
    }

    fetchProducts();
  }, [customProducts, JSON.stringify(categoryIds), tag, limit, sortBy]);

  const dynamicSlides = Math.min(products.length, 6);

  return (
    <div className="px-4 md:px-6 py-8">
      <h2 className="text-xl md:text-2xl font-medium text-center mb-2 uppercase text-[#463970]">
        {title}
      </h2>
      <div className="w-[140px] h-[1px] bg-[#A3A3A399] mx-auto mb-6" />

      <Swiper
        spaceBetween={12}
        slidesPerView={dynamicSlides}
        breakpoints={{
          480: { slidesPerView: Math.min(products.length, 2) },
          640: { slidesPerView: Math.min(products.length, 2) },
          768: { slidesPerView: Math.min(products.length, 3) },
          1024: { slidesPerView: Math.min(products.length, 4) },
          1280: { slidesPerView: Math.min(products.length, 6) },
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
