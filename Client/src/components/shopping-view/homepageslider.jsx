import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { Swiper as SwiperCore } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "./homepageslider.css";
import axios from "axios";

export default function OccasionImageSlider() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/admin/banners`)
      .then((res) => {
        if (Array.isArray(res.data)) setBanners(res.data);
        else setBanners([]);
      })
      .catch((err) => {
        console.error("Failed to fetch banners:", err);
        setBanners([]);
      });
  }, []);

  const images = banners
    .filter((b) => b.isActive && (b.desktopImage || b.mobileImage))
    .map((b) => (isMobile ? b.mobileImage : b.desktopImage));

  return (
    <div className="relative w-full">
      <Swiper
        modules={[Navigation, Autoplay]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        navigation
        loop={images.length > 1} // Loop only if more than 1 slide
        className="w-full"
      >
        {images.map((url, i) => (
          <SwiperSlide key={i}>
            <img
              src={url}
              alt={`Occasion ${i}`}
              className="w-full h-[400px] md:h-auto object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
