// Client/src/components/admin-view/SectionSettingsPanel.jsx

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SectionSettingsPanel({ block, onChange, onCancel }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    setFormData(block?.data || {});
  }, [block]);

  if (!block) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const renderFields = () => {
    switch (block.type) {
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
        <Button onClick={() => onChange(formData)}>Save</Button> {/* ✅ FIXED HERE */}
      </div>
    </aside>
  );
}
