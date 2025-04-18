// File: src/pages/admin-view/product-edit.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { MultiSelect } from "@/components/ui/multiselect";
import ImageMultiUpload from "@/components/admin-view/image-multi-upload";

export default function AdminProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [allCategories, setAllCategories] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/admin/products/${id}`)
      .then(res => {
        if (res.data.success) {
          const product = res.data.data;
          // Normalize category values to _id strings
          const normalized = {
            ...product,
            categories: (product.categories || []).map(c =>
              typeof c === "object" && c._id ? c._id : c
            ),
          };
          setFormData(normalized);
        }
      });

    axios.get(`${import.meta.env.VITE_API_URL}/api/categories`).then((res) => {
      const flatList = flattenCategories(res.data);
      setAllCategories(flatList);
    });
  }, [id]);

  const flattenCategories = (tree) => {
    let result = [];
    for (const cat of tree) {
      result.push({ label: cat.name, value: cat._id });
      if (cat.children?.length) {
        result = result.concat(flattenCategories(cat.children));
      }
    }
    return result;
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/products/edit/${id}`, formData);
      if (res.data.success) navigate("/admin/products");
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  if (!formData?._id) {
    return <div className="p-6 text-gray-500 animate-pulse">Loading product...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Edit Product</h2>
        <Button onClick={handleSubmit}>Save</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Input
            placeholder="Title"
            value={formData.title || ""}
            onChange={e => handleChange("title", e.target.value)}
          />
          <Textarea
            placeholder="Description"
            value={formData.description || ""}
            onChange={e => handleChange("description", e.target.value)}
          />
          <ImageMultiUpload
  images={formData.images || []}
  onChange={(imgs) => handleChange("images", imgs)}
/>

          <Input
            placeholder="Slug"
            value={formData.slug || ""}
            onChange={e => handleChange("slug", e.target.value)}
          />
          <Input
            placeholder="SKU"
            value={formData.sku || ""}
            onChange={e => handleChange("sku", e.target.value)}
          />
          <Input
            placeholder="Price"
            type="number"
            value={formData.price || ""}
            onChange={e => handleChange("price", parseFloat(e.target.value))}
          />
          <Input
            placeholder="Sale Price"
            type="number"
            value={formData.salePrice || ""}
            onChange={e => handleChange("salePrice", parseFloat(e.target.value))}
          />
          <Input
            placeholder="Stock"
            type="number"
            value={formData.totalStock || ""}
            onChange={e => handleChange("totalStock", parseInt(e.target.value))}
          />
          <MultiSelect
            options={allCategories}
            selected={formData.categories || []}
            label="Categories"
            onChange={(value) => handleChange("categories", value)}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={formData.isActive || false}
              onCheckedChange={val => handleChange("isActive", val)}
            />
            <label>Active</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={formData.isFeatured || false}
              onCheckedChange={val => handleChange("isFeatured", val)}
            />
            <label>Featured</label>
          </div>
        </div>
      </div>
    </div>
  );
}
