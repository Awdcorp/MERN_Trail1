export default function PublicSectionRenderer({ type, data = {} }) {
  switch (type) {
    case "layout-section": {
      const widths = data.columnWidths || [];
      const elements = data.elements || [];
      const padding = data.padding || "1rem";
      const gap = data.gap || "1rem";
      const bgColor = data.backgroundColor || "#fff";
      const customClass = data.customClass || "";
      const margin = data.margin || "";
const borderWidth = data.borderWidth || "";
const borderColor = data.borderColor || "";
const borderStyle = data.borderStyle || "";
const borderRadius = data.borderRadius || "";
const boxShadow = data.boxShadow || "";
const backgroundImage = data.backgroundImage || "";
const columnStyles = data.columnStyles || [];


      return (
        <div
          className={`flex w-full mb-6 ${customClass}`}
          style={{
  backgroundColor: bgColor,
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
    backgroundColor: columnStyles[i]?.backgroundColor || undefined,
    padding: columnStyles[i]?.padding || undefined,
    textAlign: columnStyles[i]?.textAlign || undefined,
    display: "flex",
    flexDirection: "column",
    alignItems: columnStyles[i]?.alignItems || undefined,
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

    default:
      return <div className="text-red-400 text-sm">Unsupported block type: {type}</div>;
  }
}
