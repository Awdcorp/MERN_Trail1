import { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import ShoppingProductTile from "@/components/shopping-view/product-tile";

export default function NewArrivalsSection() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchNewArrivals() {
      try {
        const res = await axios.get("http://localhost:5000/api/shop/products/get", {
          params: {
            tag: "new-arrival",
            sortBy: "date-newest",
          },
        });
        setProducts(res.data.data || []);
      } catch (err) {
        console.error("❌ Failed to fetch new arrivals:", err);
      }
    }

    fetchNewArrivals();
  }, []);

  return (
    <div className="px-4 md:px-6 py-8">
      <h2 className="text-xl md:text-2xl text-center mb-2 uppercase text-[#463970]">
        NEW ARRIVALS
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
            <ShoppingProductTile product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
