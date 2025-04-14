// File: Client/src/components/home/OcassionImageSlider.jsx

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "./homepageslider.css"; // custom CSS for arrow color

const desktopImages = [
  "https://res.cloudinary.com/dyiupjfwp/image/upload/v1744640504/partyworld/occasions/b02ypyy3sbbeul8m0z2r.webp",
  "https://res.cloudinary.com/dyiupjfwp/image/upload/v1744640505/partyworld/occasions/z9rr2czx3lcabcqfwrrt.webp",
  "https://res.cloudinary.com/dyiupjfwp/image/upload/v1744640502/partyworld/occasions/rd1k7z0ji87eawigvirl.webp",
  "https://res.cloudinary.com/dyiupjfwp/image/upload/v1744640506/partyworld/occasions/jbyw7mwdby5fd5cexwo8.webp",
  
];

const mobileImages = [
  "https://res.cloudinary.com/dyiupjfwp/image/upload/v1744640506/partyworld/occasions/puy7mgh5uuvct5aamdvx.jpg",
  "https://res.cloudinary.com/dyiupjfwp/image/upload/v1744640507/partyworld/occasions/dm7lwmlciywuuku8g8td.jpg",
  "https://res.cloudinary.com/dyiupjfwp/image/upload/v1744640508/partyworld/occasions/ops7mhv6r6n9jzsz5qhi.jpg",
  "https://res.cloudinary.com/dyiupjfwp/image/upload/v1744640509/partyworld/occasions/nmu1ftzsjom8amey2iiv.webp",
];


export default function OccasionImageSlider() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
    useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth < 768);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);
  
    const images = isMobile ? mobileImages : desktopImages;
  
    return (
      <div className="relative w-full">
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={true}
          className="w-full"
        >
          {images.map((url, i) => (
            <SwiperSlide key={i}>
              <img
                src={url}
                alt={`Occasion ${i}`}
                className="w-full h-[400px] md:h-auto h-auto object-cover"
              />
            </SwiperSlide>
          ))}
  
          <div className="swiper-button-prev custom-arrow" />
          <div className="swiper-button-next custom-arrow" />
        </Swiper>
      </div>
    );
  }
