// Client/src/components/admin-view/SectionSettingsPanel.jsx

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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
          </>
        );

      case "layout-section":
  return (
    <>
      <label className="text-sm font-medium">Number of Columns</label>
      <select
        value={formData.layout || "2-column"}
        onChange={(e) => {
          const layout = e.target.value;
          const columns = layout === "1-column" ? 1 : layout === "3-column" ? 3 : 2;
          const elements = Array.from({ length: columns }, (_, i) => formData.elements?.[i] || []);
          const columnWidths = Array(columns).fill(100 / columns);
          handleChange("layout", layout);
          handleChange("elements", elements);
          handleChange("columnWidths", columnWidths);
        }}
        className="w-full border rounded p-2 mb-4"
      >
        <option value="1-column">1 Column</option>
        <option value="2-column">2 Columns</option>
        <option value="3-column">3 Columns</option>
      </select>

      {(formData.elements || []).map((col, colIndex) => (
        <div key={colIndex} className="mb-4">
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
        </div>
      ))}

      {(formData.columnWidths || []).map((width, idx) => (
        <div key={idx} className="mb-2 flex items-center gap-2">
          <label className="text-xs text-gray-500">Column {idx + 1} Width (%)</label>
          <Input
            type="number"
            min={10}
            max={100}
            value={width}
            onChange={e => {
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


      case "product-slider":
        return (
          <>
            <label className="text-sm font-medium">Title</label>
            <Input value={formData.title || ""} onChange={(e) => handleChange("title", e.target.value)} className="mb-4" />

            <label className="text-sm font-medium">Limit</label>
            <Input type="number" value={formData.limit || 0} onChange={(e) => handleChange("limit", parseInt(e.target.value))} className="mb-4" />
          </>
        );

      case "contact-info":
        return (
          <>
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
            <Input value={formData.buttonText || ""} onChange={(e) => handleChange("buttonText", e.target.value)} className="mb-4" />

            <label className="text-sm font-medium">Button Link</label>
            <Input value={formData.buttonLink || ""} onChange={(e) => handleChange("buttonLink", e.target.value)} className="mb-4" />
          </>
        );

      default:
        return <div className="text-sm text-gray-500">No editable fields for this block yet.</div>;
    }
  };

  return (
    <aside className={`transition-all duration-300 w-[320px] bg-white shadow-xl border-l p-4 fixed top-0 right-0 h-full z-40`}>
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
