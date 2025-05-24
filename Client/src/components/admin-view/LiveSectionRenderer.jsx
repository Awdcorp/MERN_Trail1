// File: Client/src/components/admin-view/LiveSectionRenderer.jsx

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
      if (!data?.title || !data?.limit) {
        return <PreviewWrapper><div className="text-red-500 text-sm">❗ Missing title or limit</div></PreviewWrapper>;
      }
      return <PreviewWrapper><ProductSliderSection {...data} /></PreviewWrapper>;

    case "category-grid":
      return <CategorySection {...data} />;

    case "theme-grid":
      return <ThemeCategorySection {...data} />;

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


    case "layout-section": {
      const widths = data.columnWidths && data.columnWidths.length === (data.elements?.length || 0)
        ? data.columnWidths
        : Array(data.elements?.length || 2).fill(100 / (data.elements?.length || 2));
      const elements = data.elements || [];

      const columnStyles = data.columnStyles || [];

      // Section styles
      const {
        padding = "1rem",
        gap = "0.25rem",
        backgroundColor = "white",
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

      // Visibility logic
      if (
        (visibility === "desktop" && window.innerWidth < 768) ||
        (visibility === "mobile" && window.innerWidth >= 768)
      ) return null;

      return (
        <div
          className={`flex w-full rounded overflow-hidden border ${customClass}`}
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
            boxShadow
          }}
        >
          {elements.map((col, i) => (
            <div
              key={i}
              className="relative"
              style={{
                width: `${widths[i]}%`,
                minWidth: 40,
                backgroundColor: columnStyles[i]?.backgroundColor || undefined,
                padding: columnStyles[i]?.padding || undefined,
                textAlign: columnStyles[i]?.textAlign || undefined,
                display: "flex",
                flexDirection: "column",
                alignItems: columnStyles[i]?.alignItems || undefined,
              }}
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
