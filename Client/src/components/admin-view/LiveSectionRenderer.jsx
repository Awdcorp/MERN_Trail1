import HomepageSlider from "@/components/shopping-view/homepageslider";
import ProductSliderSection from "@/components/shopping-view/newarrivalsslider";
import CategorySection from "@/components/shopping-view/occasioncategorysection";
import ThemeCategorySection from "@/components/shopping-view/themecategorysection";
import { PhoneCall } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const PreviewWrapper = ({ children }) => (
  <div className="relative w-full max-w-full px-2">
    <div className="max-w-[750px] w-full mx-auto overflow-hidden rounded-xl shadow-md bg-white">
      <div className="scale-[0.95] origin-top">
        {children}
      </div>
    </div>
  </div>
);



export default function LiveSectionRenderer({ type, data = {} }) {
  switch (type) {
    case "slider":
      return (
        <PreviewWrapper>
          <HomepageSlider {...data} />
        </PreviewWrapper>
      );

    case "product-slider":
      return (
        <PreviewWrapper>
          <ProductSliderSection {...data} />
        </PreviewWrapper>
      );

    case "category-grid":
      return <CategorySection {...data} />;

    case "theme-grid":
      return <ThemeCategorySection {...data} />;

    case "contact-info":
      return (
        <div className="px-4 pt-10 md:px-8 py-10 bg-white text-center">
          <div className="flex flex-col pt-10 md:flex-row justify-center items-center gap-10 md:gap-20 mb-10">
            {(data.phones || []).map((phone, i) => (
              <div key={`phone-${i}`} className="flex items-center gap-3 text-xl text-[#2D2D2D]">
                <PhoneCall size={28} className="text-[#463970]" />
                <span>{phone}</span>
              </div>
            ))}

            {(data.whatsapp || []).map((wa, i) => (
              <div key={`wa-${i}`} className="flex items-center gap-3 text-xl text-[#2D2D2D]">
                <FaWhatsapp
                  size={28}
                  className={i === 1 ? "bg-[#463970] text-white p-1 rounded" : "text-[#25D366]"}
                />
                <span>{wa}</span>
              </div>
            ))}
          </div>

          {data.buttonText && (
            <a href={data.buttonLink || "#"}>
              <button className="bg-[#463970] text-white px-6 py-2 rounded-full text-sm shadow-md hover:opacity-90 transition">
                {data.buttonText}
              </button>
            </a>
          )}
        </div>
      );

    default:
      return <div className="text-red-500 text-sm">❌ No renderer for "{type || 'undefined'}"</div>;
  }
}
