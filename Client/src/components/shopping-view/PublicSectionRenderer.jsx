// File: Client/src/components/admin-view/PublicSectionRenderer.jsx

import HomepageSlider from "@/components/shopping-view/homepageslider";
import ProductSliderSection from "@/components/shopping-view/ProductSliderSection";
import CategorySection from "@/components/shopping-view/CategorySection";
import ThemeCategorySection from "@/components/shopping-view/themecategorysection";
import { PhoneCall } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export default function PublicSectionRenderer({ type, data = {} }) {
  switch (type) {
    case "layout-section": {
      const widths = data.columnWidths || [];
      const elements = data.elements || [];
      const columnStyles = data.columnStyles || [];

      const {
        padding = "1rem",
        gap = "1rem",
        backgroundColor = "#fff",
        customClass = "",
        margin = "",
        borderWidth = "",
        borderColor = "",
        borderStyle = "",
        borderRadius = "",
        boxShadow = "",
        backgroundImage = "",
        visibility = "all"
      } = data;

      if (
        (visibility === "desktop" && typeof window !== "undefined" && window.innerWidth < 768) ||
        (visibility === "mobile" && typeof window !== "undefined" && window.innerWidth >= 768)
      ) return null;

      return (
        <div
          className={`flex w-full mb-6 ${customClass}`}
          style={{
            backgroundColor,
            backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
            backgroundSize: backgroundImage ? "cover" : undefined,
            padding,
            gap,
            margin,
            borderWidth,
            borderColor,
            borderStyle,
            borderRadius,
            boxShadow,
          }}
        >
          {elements.map((col, i) => (
            <div
              key={i}
              style={{
                width: `${widths[i] || 100 / elements.length}%`,
                backgroundColor: columnStyles[i]?.backgroundColor,
                padding: columnStyles[i]?.padding,
                textAlign: columnStyles[i]?.textAlign,
                display: "flex",
                flexDirection: "column",
                alignItems: columnStyles[i]?.alignItems,
              }}
            >
              {(col || []).map((el, j) => {
                if (el.type === "text") {
                  return (
                    <div
                      key={j}
                      className="text-base text-gray-800 leading-relaxed mb-2"
                      dangerouslySetInnerHTML={{ __html: el.data?.html || "" }}
                    />
                  );
                }
                return null;
              })}
            </div>
          ))}
        </div>
      );
    }
    case "text":
  return (
    <div
      className={`text-base text-gray-800 leading-relaxed ${data.customClass || ""}`}
      style={{
        textAlign: data.textAlign || undefined,
        color: data.color || undefined,
        fontSize: data.fontSize || undefined,
        fontWeight: data.fontWeight || undefined,
        margin: data.margin || undefined,
        padding: data.padding || undefined,
        backgroundColor: data.backgroundColor || undefined,
      }}
    >
      <div dangerouslySetInnerHTML={{ __html: data.html || "" }} />
    </div>
  );


    case "slider":
  return (
    <div className="-mx-4 md:-mx-8">
      <HomepageSlider images={data.images} autoplay={data.autoplay} />
    </div>
  );

    case "product-slider":
      return <ProductSliderSection
  title={data.title}
  categoryIds={data.categoryIds || []}
  sortBy={data.sortBy || "date-newest"}
  limit={data.limit || 10}
/>
;

    case "category-grid":
  return <CategorySection
  title={data.title}
  groupName={data.groupName}
  limit={data.limit || 6}
  isSlider={data.isSlider !== false}
/>
;
case "store-locations": {
  const defaultStores = [
    {
      name: "AL BARSHA",
      address: "Iridium building, Umm Suqeim Road, Barsha, Dubai",
      color: "from-[#B7117A]",
      buttonColor: "#B7117A",
      mapSrc: "https://www.google.com/maps/embed?...",
    },
    {
      name: "THE SPRINGS SOUK",
      address: "The Springs Souk, Ground floor, Dubai",
      color: "from-[#00B0BA]",
      buttonColor: "#00B0BA",
      mapSrc: "https://www.google.com/maps/embed?...",
    },
    {
      name: "MOTORCITY",
      address: "Foxhill 9 building, Ground floor, Motor City, Dubai",
      color: "from-[#F18074]",
      buttonColor: "#F18074",
      mapSrc: "https://www.google.com/maps/embed?...",
    },
    {
      name: "ARABIAN RANCHES",
      address: "Arabian Ranches III Souk, Dubai",
      color: "from-[#B7117A]",
      buttonColor: "#B7117A",
      mapSrc: "https://www.google.com/maps/embed?...",
    },
  ];

  const stores = (data.stores && data.stores.length > 0) ? data.stores : defaultStores;

  return (
    <div className="px-4 md:px-8 mt-10">
      <h2 className="text-2xl font-medium text-center mb-2 pt-5 uppercase text-[#463970]">
        Visit Our Stores
      </h2>
      <div className="w-[140px] h-[1.9px] bg-[#A3A3A399] mx-auto mb-10" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stores.map((store, idx) => (
          <div
            key={idx}
            className="relative overflow-hidden rounded-xl shadow-md text-center text-[#2D2D2D]"
          >
            <div
              className={`absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t ${store.color} to-transparent z-0`}
            />
            <div className="relative z-10 p-4 flex flex-col items-center">
              <div
                className="text-white text-xs font-semibold tracking-widest uppercase h-10 w-44 flex items-center justify-center rounded-md mx-auto"
                style={{ backgroundColor: store.buttonColor }}
              >
                {store.name}
              </div>
              <h3 className="text-center text-[14px] font-medium leading-snug mb-1 pt-5 max-w-[80%] mx-auto px-2">
                {store.address}
              </h3>
              <div className="w-[100%] h-[1px] bg-black my-3" />
              <iframe
                src={store.mapSrc}
                width="100%"
                height="230"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={store.name}
                className="rounded-md"
              ></iframe>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


    case "contact-info": {
  const {
    phones = [],
    whatsapp = [],
    buttonText,
    buttonLink,
    title,
    subtitle,
    textAlign = "center",
    fontColor,
    backgroundColor,
    customClass
  } = data;

  return (
    <div
      className={`px-4 pt-10 md:px-8 py-10 ${customClass || ""}`}
      style={{
        backgroundColor: backgroundColor || "#fff",
        color: fontColor || undefined,
        textAlign,
      }}
    >
      {title && <h2 className="text-2xl font-semibold mb-2">{title}</h2>}
      {subtitle && <p className="text-gray-500 mb-6">{subtitle}</p>}

      <div className="flex flex-col pt-10 md:flex-row justify-center items-center gap-10 md:gap-20 mb-10">
        {phones.map((phone, i) => (
          <div key={`phone-${i}`} className="flex items-center gap-3 text-xl text-[#2D2D2D]">
            <PhoneCall size={28} className="text-[#463970]" />
            <span>{phone}</span>
          </div>
        ))}

        {whatsapp.map((wa, i) => (
          <div key={`wh-${i}`} className="flex items-center gap-3 text-xl text-[#2D2D2D]">
            <FaWhatsapp
              size={28}
              className={`text-white p-1 rounded ${i % 2 === 0 ? 'bg-[#25D366]' : 'bg-[#463970]'}`}
            />
            <span>{wa}</span>
          </div>
        ))}
      </div>

      {buttonText && buttonLink && (
        <a href={buttonLink} target="_blank" rel="noopener noreferrer">
          <button className="bg-[#463970] text-white px-6 py-2 rounded-full text-sm shadow-md hover:opacity-90 transition">
            {buttonText}
          </button>
        </a>
      )}
    </div>
  );
}

    default:
      return <div className="text-red-400 text-sm">Unsupported block type: {type}</div>;
  }
}
