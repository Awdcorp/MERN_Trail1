// Client/src/components/admin-view/LiveSectionRenderer.jsx

import HomepageSlider from "@/components/shopping-view/homepageslider";
import ProductSliderSection from "@/components/shopping-view/newarrivalsslider";
import CategorySection from "@/components/shopping-view/occasioncategorysection";
import ThemeCategorySection from "@/components/shopping-view/themecategorysection";
import { PhoneCall } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useDrop } from "react-dnd";

const PreviewWrapper = ({ children }) => (
  <div className="relative w-full max-w-full px-2">
    <div className="max-w-[1024px] w-full mx-auto overflow-hidden rounded-xl shadow-md bg-white">
      <div className="scale-[0.95] origin-top">
        {children}
      </div>
    </div>
  </div>
);

function InnerElementRenderer({ type, data }) {
  switch (type) {
    case "text":
      return <div className="text-base text-gray-700" dangerouslySetInnerHTML={{ __html: data.html || "" }} />;
    default:
      return <div className="text-red-400 text-sm">Unsupported element</div>;
  }
}

function ColumnDropZone({ blockKey, columnIndex, elements, onDropElement }) {
  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: "BLOCK",
    drop: (item) => {
      if (item.type === "text") {
        onDropElement(blockKey, columnIndex, { type: "text", data: { html: "<p>New Text</p>" } });
      }
    },
    collect: (monitor) => ({ isOver: monitor.isOver() })
  }), [blockKey, columnIndex]);

  return (
    <div
      ref={dropRef}
      className={`min-h-[120px] border rounded p-4 text-sm text-gray-600 space-y-4 transition-colors ${
        isOver ? "bg-indigo-50 border-indigo-500" : "border-dashed border-gray-300"
      }`}
    >
      {elements.map((el, i) => (
        <InnerElementRenderer key={i} type={el.type} data={el.data} />
      ))}
      <div className="text-center text-gray-400">+ Drop Text Element Here</div>
    </div>
  );
}

export default function LiveSectionRenderer({ type, data = {}, blockKey, onDropElement }) {
  switch (type) {
    case "slider":
      return <PreviewWrapper><HomepageSlider {...data} /></PreviewWrapper>;

    case "product-slider":
      if (!data?.title || !data?.limit) {
        return <PreviewWrapper><div className="text-red-500 text-sm">❗ Missing title or limit</div></PreviewWrapper>;
      }
      return <PreviewWrapper><ProductSliderSection {...data} /></PreviewWrapper>;

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

    case "layout-section":
      const cols = data.layout === "3-column" ? 3 : data.layout === "2-column" ? 2 : 1;
      return (
        <div className="bg-white border rounded-md p-4">
          <div className={`grid gap-4 ${cols === 1 ? "grid-cols-1" : cols === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
            {Array(cols).fill(0).map((_, colIndex) => (
              <ColumnDropZone
                key={colIndex}
                blockKey={blockKey}
                columnIndex={colIndex}
                elements={data.elements?.[colIndex] || []}
                onDropElement={onDropElement}
              />
            ))}
          </div>
        </div>
      );
          case "text":
      return (
        <div className="bg-white p-4 border rounded shadow-sm text-sm text-gray-700">
          <div dangerouslySetInnerHTML={{ __html: data.html || "<p>Text block</p>" }} />
        </div>
      );

    default:
      return <div className="text-red-500 text-sm">❌ No renderer for "{type || 'undefined'}"</div>;
  }
}
