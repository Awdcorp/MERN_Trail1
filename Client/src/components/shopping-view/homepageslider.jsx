import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "./homepageslider.css";
import axios from "axios";

export default function HomepageSlider({ images: propImages, autoplay = true }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!propImages || propImages.length === 0) {
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
    }
  }, [propImages]);

  const dynamicImages = propImages && propImages.length > 0
  ? propImages.map((b) => isMobile ? b.mobileImage : b.desktopImage)
  : banners
      .filter((b) => b.isActive && (b.desktopImage || b.mobileImage))
      .map((b) => isMobile ? b.mobileImage : b.desktopImage);

  return (
    <div className="relative w-full">
      <Swiper
        modules={[Navigation, Autoplay]}
        autoplay={autoplay ? { delay: 3000, disableOnInteraction: false } : false}
        navigation
        loop={dynamicImages.length > 1}
        className="w-full"
      >
        {dynamicImages.map((url, i) => (
          <SwiperSlide key={i}>
            <img
              src={url}
              alt={`Slide ${i}`}
              className="w-full h-[400px] md:h-auto object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
