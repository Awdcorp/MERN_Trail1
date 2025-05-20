// src/components/admin-view/homepage/section-form.jsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function SectionForm({ onSave, onCancel }) {
  const [type, setType] = useState("");
  const [formData, setFormData] = useState({});

  const handleTypeChange = (e) => {
    setType(e.target.value);
    setFormData({});
  };

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!type) return;
    onSave({ type, data: formData });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md">
      <div>
        <label className="block font-medium mb-1">Section Type</label>
        <select
          value={type}
          onChange={handleTypeChange}
          className="w-full border rounded px-2 py-1"
        >
          <option value="">Select a type</option>
          <option value="slider">Slider</option>
          <option value="product-slider">Product Slider</option>
          <option value="category-grid">Category Grid</option>
        </select>
      </div>

      {type === "product-slider" && (
        <>
          <Input
            placeholder="Title"
            value={formData.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
          />
          <Input
            placeholder="Comma-separated Category IDs"
            value={formData.categoryIds || ""}
            onChange={(e) => handleChange("categoryIds", e.target.value)}
          />
          <Input
            placeholder="Limit"
            type="number"
            value={formData.limit || 10}
            onChange={(e) => handleChange("limit", parseInt(e.target.value))}
          />
        </>
      )}

      {type === "category-grid" && (
        <>
          <Input
            placeholder="Title"
            value={formData.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
          />
          <Textarea
            placeholder="Categories JSON: [{ name, image, slug }]"
            value={formData.categoriesRaw || ""}
            onChange={(e) => handleChange("categoriesRaw", e.target.value)}
          />
        </>
      )}

      {type && (
        <div className="flex gap-4">
          <Button type="submit">Save Section</Button>
          <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        </div>
      )}
    </form>
  );
}