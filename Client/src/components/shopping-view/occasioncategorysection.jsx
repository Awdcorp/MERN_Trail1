// File: client/src/components/homepage/OccasionCategorySection.jsx

import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const occasionCategories = [
  {
    name: "Happy New Year",
    image:
      "https://res.cloudinary.com/dyiupjfwp/image/upload/v1744378811/partyworld/occasions/uyteyyemrpzwl51eqspl.webp",
  },
  {
    name: "Bachelorette",
    image:
      "https://res.cloudinary.com/dyiupjfwp/image/upload/v1744378813/partyworld/occasions/uurwwqhqwy6g30caxqeo.webp",
  },
  {
    name: "Back to school",
    image:
      "https://res.cloudinary.com/dyiupjfwp/image/upload/v1744378815/partyworld/occasions/vmggurjmnlrxrrejozys.webp",
  },
  {
    name: "Happy Birthday",
    image:
      "https://res.cloudinary.com/dyiupjfwp/image/upload/v1744378816/partyworld/occasions/yx6jhlpoykip5yfbe98z.webp",
  },
  {
    name: "Chinese New Year",
    image:
      "https://res.cloudinary.com/dyiupjfwp/image/upload/v1744378817/partyworld/occasions/whc26jtzvheakozscyrw.webp",
  },
  {
    name: "Christmas",
    image:
      "https://res.cloudinary.com/dyiupjfwp/image/upload/v1744378818/partyworld/occasions/bjr1ca1mlqdjbrnzw2py.webp",
  },
  {
    name: "Easter",
    image:
      "https://res.cloudinary.com/dyiupjfwp/image/upload/v1744378819/partyworld/occasions/hnb9h68eh943pbvpexfj.webp",
  },
  {
    name: "Eid",
    image:
      "https://res.cloudinary.com/dyiupjfwp/image/upload/v1744378820/partyworld/occasions/mhypnqd0lrnsbccr71hj.webp",
  },
  {
    name: "Engagement",
    image:
      "https://res.cloudinary.com/dyiupjfwp/image/upload/v1744378821/partyworld/occasions/a7pg0nen42ys485n8j8a.webp",
  },
  {
    name: "Fathers Day",
    image:
      "https://res.cloudinary.com/dyiupjfwp/image/upload/v1744378822/partyworld/occasions/vf2frttxjrz3fg6wasew.webp",
  },
  {
    name: "Gender Reveal",
    image:
      "https://res.cloudinary.com/dyiupjfwp/image/upload/v1744378823/partyworld/occasions/li8czvuuqrsw3ezg568k.webp",
  },
  {
    name: "Graduation",
    image:
      "https://res.cloudinary.com/dyiupjfwp/image/upload/v1744378824/partyworld/occasions/wt6idpqy131gqcmazvmb.webp",
  },
  {
    name: "Halloween",
    image:
      "https://res.cloudinary.com/dyiupjfwp/image/upload/v1744378826/partyworld/occasions/oeptigvw7qqwt71yifmc.webp",
  },
  {
    name: "Mothers Day",
    image:
      "https://res.cloudinary.com/dyiupjfwp/image/upload/v1744378827/partyworld/occasions/pl9npfjbevhyhgsh1g6t.webp",
  },
];

export default function OccasionCategorySection() {
  return (
    <div className="px-4 md:px-8 mt-10">
      <h2 className="text-2xl font-bold text-center mb-2 uppercase" style={{ color: "#463970" }}>
        Shop by Occasion
      </h2>
      <div className="w-[120px] h-[1.9px] bg-[#A3A3A399] mx-auto mb-10" />
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
        {occasionCategories.map((category, index) => (
          <SwiperSlide key={index}>
            <Link
              to={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="flex flex-col items-center justify-center"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <span className="text-sm text-center"  style={{ color: "#463970",fontSize: "15px",
    fontWeight: 400, }}>
                {category.name}
              </span>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
