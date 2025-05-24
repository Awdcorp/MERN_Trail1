// File: Client/src/components/admin-view/SectionSettingsPanel.jsx

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import MediaPicker from "@/components/admin-view/MediaPicker";
export default function SectionSettingsPanel({ block, onSave, onCancel, onLiveUpdate }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    setFormData(block?.data || {});
  }, [block]);

  if (!block) return null;

  const handleChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    if (onLiveUpdate) onLiveUpdate(updated);
  };

  const updateInnerText = (colIndex, elIndex, value) => {
    const updated = [...(formData.elements || [])];
    if (!updated[colIndex] || !updated[colIndex][elIndex]) return;
    updated[colIndex][elIndex].data.html = value;
    handleChange("elements", updated);
  };

  const renderFields = () => {
    switch (block.type) {
      case "contact-info":
  return (
    <>
      <label className="text-sm font-medium">Title</label>
      <Input
        value={formData.title || ""}
        onChange={(e) => handleChange("title", e.target.value)}
        className="mb-4"
      />

      <label className="text-sm font-medium">Subtitle</label>
      <Input
        value={formData.subtitle || ""}
        onChange={(e) => handleChange("subtitle", e.target.value)}
        className="mb-4"
      />

      <label className="text-sm font-medium">Phone (comma separated)</label>
      <Input
        value={(formData.phones || []).join(", ")}
        onChange={(e) => handleChange("phones", e.target.value.split(",").map(v => v.trim()))}
        className="mb-4"
      />

      <label className="text-sm font-medium">WhatsApp (comma separated)</label>
      <Input
        value={(formData.whatsapp || []).join(", ")}
        onChange={(e) => handleChange("whatsapp", e.target.value.split(",").map(v => v.trim()))}
        className="mb-4"
      />

      <label className="text-sm font-medium">Button Text</label>
      <Input
        value={formData.buttonText || ""}
        onChange={(e) => handleChange("buttonText", e.target.value)}
        className="mb-4"
      />

      <label className="text-sm font-medium">Button Link</label>
      <Input
        value={formData.buttonLink || ""}
        onChange={(e) => handleChange("buttonLink", e.target.value)}
        className="mb-4"
      />

      <label className="text-sm font-medium">Text Align</label>
      <select
        value={formData.textAlign || ""}
        onChange={(e) => handleChange("textAlign", e.target.value)}
        className="w-full border rounded p-2 mb-4"
      >
        <option value="">Default</option>
        <option value="left">Left</option>
        <option value="center">Center</option>
        <option value="right">Right</option>
      </select>

      <label className="text-sm font-medium">Font Color</label>
      <Input
        value={formData.fontColor || ""}
        onChange={(e) => handleChange("fontColor", e.target.value)}
        placeholder="e.g. #222 or gray"
        className="mb-4"
      />

      <label className="text-sm font-medium">Background Color</label>
      <Input
        value={formData.backgroundColor || ""}
        onChange={(e) => handleChange("backgroundColor", e.target.value)}
        className="mb-4"
      />

      <label className="text-sm font-medium">Custom Class</label>
      <Input
        value={formData.customClass || ""}
        onChange={(e) => handleChange("customClass", e.target.value)}
        className="mb-4"
      />
    </>
  );

      case "text":
  return (
    <>
      <label className="text-sm font-medium">HTML Content</label>
      <Textarea
        value={formData.html || ""}
        onChange={(e) => handleChange("html", e.target.value)}
        rows={6}
        className="mb-4"
      />

      <label className="text-sm font-medium">Text Align</label>
      <select
        value={formData.textAlign || ""}
        onChange={(e) => handleChange("textAlign", e.target.value)}
        className="w-full border rounded p-2 mb-4"
      >
        <option value="">Default</option>
        <option value="left">Left</option>
        <option value="center">Center</option>
        <option value="right">Right</option>
      </select>

      <label className="text-sm font-medium">Text Color</label>
      <Input
        value={formData.color || ""}
        onChange={(e) => handleChange("color", e.target.value)}
        placeholder="e.g. #333 or red"
        className="mb-4"
      />

      <label className="text-sm font-medium">Font Size</label>
      <Input
        value={formData.fontSize || ""}
        onChange={(e) => handleChange("fontSize", e.target.value)}
        placeholder="e.g. 16px or 1.25rem"
        className="mb-4"
      />

      <label className="text-sm font-medium">Font Weight</label>
      <select
        value={formData.fontWeight || ""}
        onChange={(e) => handleChange("fontWeight", e.target.value)}
        className="w-full border rounded p-2 mb-4"
      >
        <option value="">Default</option>
        <option value="300">Light</option>
        <option value="400">Normal</option>
        <option value="500">Medium</option>
        <option value="600">Semi-bold</option>
        <option value="700">Bold</option>
      </select>

      <label className="text-sm font-medium">Margin</label>
      <Input
        value={formData.margin || ""}
        onChange={(e) => handleChange("margin", e.target.value)}
        placeholder="e.g. 10px 0"
        className="mb-4"
      />

      <label className="text-sm font-medium">Padding</label>
      <Input
        value={formData.padding || ""}
        onChange={(e) => handleChange("padding", e.target.value)}
        placeholder="e.g. 1rem"
        className="mb-4"
      />

      <label className="text-sm font-medium">Background Color</label>
      <Input
        value={formData.backgroundColor || ""}
        onChange={(e) => handleChange("backgroundColor", e.target.value)}
        placeholder="e.g. #f5f5f5"
        className="mb-4"
      />

      <label className="text-sm font-medium">Custom Class</label>
      <Input
        value={formData.customClass || ""}
        onChange={(e) => handleChange("customClass", e.target.value)}
        placeholder="Tailwind or CSS class"
        className="mb-4"
      />
    </>
  );
case "slider":
  const [mediaPickerOpen, setMediaPickerOpen] = useState({ index: null, type: "" });

  return (
    <>
      {(formData.images || []).map((img, i) => (
        <div key={i} className="border p-3 rounded mb-4 space-y-2 bg-gray-50">
          <div className="text-xs font-semibold">Slide #{i + 1}</div>

          {/* Desktop Image */}
          {img.desktopImage && <img src={img.desktopImage} alt="desktop" className="w-full h-28 object-cover rounded" />}
          <Button size="sm" variant="outline" onClick={() => setMediaPickerOpen({ index: i, type: "desktopImage" })}>
            Select Desktop Image
          </Button>

          {/* Mobile Image */}
          {img.mobileImage && <img src={img.mobileImage} alt="mobile" className="w-full h-28 object-cover rounded" />}
          <Button size="sm" variant="outline" onClick={() => setMediaPickerOpen({ index: i, type: "mobileImage" })}>
            Select Mobile Image
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={() => {
              const updated = [...formData.images];
              updated.splice(i, 1);
              handleChange("images", updated);
            }}
          >
            Remove Slide
          </Button>
        </div>
      ))}

      <Button
        onClick={() => {
          const updated = [...(formData.images || [])];
          updated.push({ desktopImage: "", mobileImage: "" });
          handleChange("images", updated);
        }}
        className="mt-2"
      >
        ➕ Add Slide
      </Button>

      {/* Autoplay Toggle */}
      <hr className="my-4" />
      <label className="text-sm font-medium">Autoplay</label>
      <select
        value={formData.autoplay ? "true" : "false"}
        onChange={(e) => handleChange("autoplay", e.target.value === "true")}
        className="w-full border rounded p-2 mt-2"
      >
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>

      {/* Media Picker Modal */}
      <MediaPicker
        open={mediaPickerOpen.index !== null}
        onClose={() => setMediaPickerOpen({ index: null, type: "" })}
        onSelect={(url) => {
          const updated = [...(formData.images || [])];
          if (mediaPickerOpen.index !== null && mediaPickerOpen.type) {
            updated[mediaPickerOpen.index][mediaPickerOpen.type] = url;
            handleChange("images", updated);
          }
        }}
      />
    </>
  );



      case "layout-section":
        return (
          <>
            <label className="text-sm font-medium">Section Label</label>
            <Input
              placeholder="Optional label (e.g. Hero Section)"
              value={formData.label || ""}
              onChange={(e) => handleChange("label", e.target.value)}
              className="mb-4"
            />

            <label className="text-sm font-medium">Visibility</label>
            <select
              value={formData.visibility || "all"}
              onChange={(e) => handleChange("visibility", e.target.value)}
              className="w-full border rounded p-2 mb-4"
            >
              <option value="all">Show on All Devices</option>
              <option value="desktop">Desktop Only</option>
              <option value="mobile">Mobile Only</option>
            </select>

            <label className="text-sm font-medium">Number of Columns</label>
            <select
              value={formData.layout || "2-column"}
              onChange={(e) => {
                const layout = e.target.value;
                const columns = layout === "1-column" ? 1 : layout === "3-column" ? 3 : 2;

                const oldElements = formData.elements || [];
                const newElements = Array.from({ length: columns }, (_, i) => oldElements[i] || []);

                const evenWidth = 100 / columns;
                let newWidths = (formData.columnWidths || []).slice(0, columns);
                while (newWidths.length < columns) newWidths.push(evenWidth);
                newWidths = newWidths.map(() => evenWidth);

                const updated = {
                  ...formData,
                  layout,
                  elements: newElements,
                  columnWidths: newWidths
                };
                setFormData(updated);
                if (onLiveUpdate) onLiveUpdate(updated);
              }}
              className="w-full border rounded p-2 mb-4"
            >
              <option value="1-column">1 Column</option>
              <option value="2-column">2 Columns</option>
              <option value="3-column">3 Columns</option>
            </select>

            {(formData.elements || []).map((col, colIndex) => (
              <div key={colIndex} className="mb-6">
                <h4 className="text-sm font-semibold text-gray-600 mb-2">Column {colIndex + 1}</h4>
                {col.map((el, elIndex) => (
                  <div key={elIndex} className="mb-3">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">
                      Text Block #{elIndex + 1}
                    </label>
                    <Textarea
                      value={el.data?.html || ""}
                      onChange={(e) => updateInnerText(colIndex, elIndex, e.target.value)}
                      rows={4}
                    />
                  </div>
                ))}

                <div className="space-y-2 pl-2 border-l border-gray-100 ml-2 mt-2">
                  <label className="text-xs font-semibold text-gray-600 block">
                    Column {colIndex + 1} Styles
                  </label>

                  <Input
                    placeholder="Background color (e.g. #fff)"
                    value={formData.columnStyles?.[colIndex]?.backgroundColor || ""}
                    onChange={(e) => {
                      const updated = [...(formData.columnStyles || [])];
                      updated[colIndex] = {
                        ...updated[colIndex],
                        backgroundColor: e.target.value,
                      };
                      handleChange("columnStyles", updated);
                    }}
                    className="w-full text-xs"
                  />

                  <Input
                    placeholder="Padding (e.g. 1rem)"
                    value={formData.columnStyles?.[colIndex]?.padding || ""}
                    onChange={(e) => {
                      const updated = [...(formData.columnStyles || [])];
                      updated[colIndex] = {
                        ...updated[colIndex],
                        padding: e.target.value,
                      };
                      handleChange("columnStyles", updated);
                    }}
                    className="w-full text-xs"
                  />

                  <select
                    className="w-full text-xs border rounded p-1"
                    value={formData.columnStyles?.[colIndex]?.textAlign || ""}
                    onChange={(e) => {
                      const updated = [...(formData.columnStyles || [])];
                      updated[colIndex] = {
                        ...updated[colIndex],
                        textAlign: e.target.value,
                      };
                      handleChange("columnStyles", updated);
                    }}
                  >
                    <option value="">Horizontal Align</option>
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>

                  <select
                    className="w-full text-xs border rounded p-1"
                    value={formData.columnStyles?.[colIndex]?.alignItems || ""}
                    onChange={(e) => {
                      const updated = [...(formData.columnStyles || [])];
                      updated[colIndex] = {
                        ...updated[colIndex],
                        alignItems: e.target.value,
                      };
                      handleChange("columnStyles", updated);
                    }}
                  >
                    <option value="">Vertical Align</option>
                    <option value="flex-start">Top</option>
                    <option value="center">Middle</option>
                    <option value="flex-end">Bottom</option>
                  </select>
                </div>
              </div>
            ))}

            {(formData.columnWidths || []).map((width, idx) => (
              <div key={idx} className="mb-2 flex items-center gap-2">
                <label className="text-xs text-gray-500">
                  Column {idx + 1} Width (%)
                </label>
                <Input
                  type="number"
                  min={10}
                  max={100}
                  value={width}
                  onChange={(e) => {
                    const val = Math.max(10, Math.min(100, Number(e.target.value)));
                    const newWidths = [...formData.columnWidths];
                    newWidths[idx] = val;
                    handleChange("columnWidths", newWidths);
                  }}
                  className="w-20"
                />
              </div>
            ))}

            <hr className="my-4" />

            <label className="text-sm font-medium">Section Padding</label>
            <Input
              placeholder="e.g. 1rem or 20px 10px"
              value={formData.padding || ""}
              onChange={(e) => handleChange("padding", e.target.value)}
              className="mb-4"
            />

            <label className="text-sm font-medium">Column Gap</label>
            <Input
              placeholder="e.g. 1rem or 16px"
              value={formData.gap || ""}
              onChange={(e) => handleChange("gap", e.target.value)}
              className="mb-4"
            />

            <label className="text-sm font-medium">Margin</label>
            <Input
              placeholder="e.g. 20px 0 or 2rem auto"
              value={formData.margin || ""}
              onChange={(e) => handleChange("margin", e.target.value)}
              className="mb-4"
            />

            <label className="text-sm font-medium">Border Width</label>
            <Input
              placeholder="e.g. 1px or 0"
              value={formData.borderWidth || ""}
              onChange={(e) => handleChange("borderWidth", e.target.value)}
              className="mb-4"
            />

            <label className="text-sm font-medium">Border Color</label>
            <Input
              placeholder="e.g. #ccc or red"
              value={formData.borderColor || ""}
              onChange={(e) => handleChange("borderColor", e.target.value)}
              className="mb-4"
            />

            <label className="text-sm font-medium">Border Style</label>
            <Input
              placeholder="solid / dashed / dotted"
              value={formData.borderStyle || ""}
              onChange={(e) => handleChange("borderStyle", e.target.value)}
              className="mb-4"
            />

            <label className="text-sm font-medium">Border Radius</label>
            <Input
              placeholder="e.g. 10px or 1rem"
              value={formData.borderRadius || ""}
              onChange={(e) => handleChange("borderRadius", e.target.value)}
              className="mb-4"
            />

            <label className="text-sm font-medium">Box Shadow</label>
            <Input
              placeholder="e.g. 0 2px 8px rgba(0,0,0,0.1)"
              value={formData.boxShadow || ""}
              onChange={(e) => handleChange("boxShadow", e.target.value)}
              className="mb-4"
            />

            <label className="text-sm font-medium">Background Image URL</label>
            <Input
              placeholder="Paste image URL"
              value={formData.backgroundImage || ""}
              onChange={(e) => handleChange("backgroundImage", e.target.value)}
              className="mb-4"
            />

            <label className="text-sm font-medium">Background Color</label>
            <Input
              placeholder="e.g. #f0f0f0 or white"
              value={formData.backgroundColor || ""}
              onChange={(e) => handleChange("backgroundColor", e.target.value)}
              className="mb-4"
            />

            <label className="text-sm font-medium">Custom Class</label>
            <Input
              placeholder="Tailwind or custom CSS class"
              value={formData.customClass || ""}
              onChange={(e) => handleChange("customClass", e.target.value)}
              className="mb-4"
            />
          </>
        );

      default:
        return <div className="text-sm text-gray-500">No editable fields for this block yet.</div>;
    }
  };

  return (
    <aside className="transition-all duration-300 w-[320px] bg-white shadow-xl border-l p-4 fixed top-0 right-0 h-full z-40">
      <h2 className="text-lg font-semibold mb-4">Edit: {block.type}</h2>
      <div className="space-y-4 overflow-auto max-h-[80vh]">
        {renderFields()}
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onSave(formData)}>Save</Button>
      </div>
    </aside>
  );
}
