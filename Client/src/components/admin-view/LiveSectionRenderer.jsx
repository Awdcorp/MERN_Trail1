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

export default function LiveSectionRenderer({ type, data = {}, blockKey, onDropElement, onResizeColumn }) {
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
                <PhoneCall size={28} className="text-[#46396F]" />
                {phone}
              </div>
            ))}
            {(data.whatsapp || []).map((wh, i) => (
              <div key={`wh-${i}`} className="flex items-center gap-3 text-xl text-[#2D2D2D]">
                <FaWhatsapp size={28} className="text-green-500" />
                {wh}
              </div>
            ))}
          </div>
        </div>
      );

        case "layout-section": {
      const widths = data.columnWidths && data.columnWidths.length === (data.elements?.length || 0)
        ? data.columnWidths
        : Array(data.elements?.length || 2).fill(100 / (data.elements?.length || 2));
      const elements = data.elements || [];

      const padding = data.padding || "1rem";
      const gap = data.gap || "0.25rem";
      const bgColor = data.backgroundColor || "white";
      const customClass = data.customClass || "";

      return (
        <div
          className={`flex w-full rounded overflow-hidden border border-gray-300 ${customClass}`}
          style={{ backgroundColor: bgColor, padding, gap }}
        >
          {elements.map((col, i) => (
            <div
              key={i}
              className="relative"
              style={{ width: `${widths[i]}%`, minWidth: 40 }}
            >
              <ColumnDropZone
                blockKey={blockKey}
                columnIndex={i}
                elements={col}
                onDropElement={onDropElement}
              />
              {i < elements.length - 1 && (
                <div
                  className="absolute top-0 right-0 w-2 h-full cursor-col-resize z-10"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    const startX = e.clientX;
                    const initialWidths = [...widths];
                    const container = e.currentTarget.parentElement.parentElement;
                    const containerWidth = container.offsetWidth;

                    const onMouseMove = (moveEvent) => {
                      const deltaX = moveEvent.clientX - startX;
                      let deltaPercent = (deltaX / containerWidth) * 100;

                      const minWidth = 10;
                      let newWidths = [...initialWidths];
                      newWidths[i] = Math.max(minWidth, initialWidths[i] + deltaPercent);
                      newWidths[i + 1] = Math.max(minWidth, initialWidths[i + 1] - deltaPercent);

                      const total = newWidths.reduce((a, b) => a + b, 0);
                      newWidths = newWidths.map(w => (w / total) * 100);

                      if (onResizeColumn) {
                        onResizeColumn(blockKey, newWidths);
                      }
                    };

                    const onMouseUp = () => {
                      window.removeEventListener("mousemove", onMouseMove);
                      window.removeEventListener("mouseup", onMouseUp);
                    };

                    window.addEventListener("mousemove", onMouseMove);
                    window.addEventListener("mouseup", onMouseUp);
                  }}
                />
              )}
            </div>
          ))}
        </div>
      );
    }


    default:
      return <PreviewWrapper><div className="text-red-500 text-sm">❗ Unsupported block type: {type}</div></PreviewWrapper>;
  }
}
