import { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import ShoppingProductTile from "@/components/shopping-view/product-tile";

export default function ProductSliderSection({ title, categoryIds = [], sortBy = "date-newest", customProducts, onAddToCart }) {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    if (customProducts) {
      setProducts(customProducts);
      return;
    }
    async function fetchProducts() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/products/get`, {
          params: { category: categoryIds?.join(','), sortBy },
        });
        setProducts(res.data.data || []);
      } catch (err) {
        console.error(`❌ Failed to fetch products for ${title}`, err);
      }
    }

    fetchProducts();
  }, [customProducts, categoryIds, sortBy]);

  return (
    <div className="px-4 md:px-6 py-8">
      <h2 className="text-xl md:text-2xl font-light text-center mb-2 uppercase text-[#463970]">
        {title}
      </h2>
      <div className="w-[100px] h-[2px] bg-[#A3A3A399] mx-auto mb-6" />

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
            <ShoppingProductTile product={product}
            handleAddtoCart={() => onAddToCart?.(product._id)} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
