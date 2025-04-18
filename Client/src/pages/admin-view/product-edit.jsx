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
import { useToast } from "@/components/ui/use-toast";

export default function AdminProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState(null);
  const [allCategories, setAllCategories] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/admin/products/${id}`)
      .then(res => {
        if (res.data.success) {
          const product = res.data.data;
          const normalized = {
            ...product,
            categories: (product.categories || []).map(c => typeof c === "object" ? c._id : c),
            tags: product.tags || [],
            seo: product.seo || { metaTitle: "", metaDescription: "", focusKeyword: "" },
            variants: product.variants || [],
            attributes: product.attributes || [],
            upsellProductIds: product.upsellProductIds || [],
            relatedProductIds: product.relatedProductIds || [],
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

  const handleNestedChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const FieldLabel = ({ children }) => <label className="block text-sm font-medium text-gray-700 mb-1">{children}</label>;

  const handleSubmit = async () => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/products/edit/${id}`, formData);
      if (res.data.success) {
        toast({ title: "✅ Product updated successfully", variant: "success" });
        navigate("/admin/products");
      }
    } catch (err) {
      console.error("Update failed", err);
      toast({ title: "❌ Failed to update product", variant: "destructive" });
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
          <div>
            <FieldLabel>Title</FieldLabel>
            <Input value={formData.title || ""} onChange={e => handleChange("title", e.target.value)} />
          </div>
          <div>
            <FieldLabel>Description</FieldLabel>
            <Textarea value={formData.description || ""} onChange={e => handleChange("description", e.target.value)} />
          </div>
          <div>
            <FieldLabel>Short Description</FieldLabel>
            <Textarea value={formData.shortDescription || ""} onChange={e => handleChange("shortDescription", e.target.value)} />
          </div>
          <ImageMultiUpload images={formData.images || []} onChange={(imgs) => handleChange("images", imgs)} />
          <div>
            <FieldLabel>Slug</FieldLabel>
            <Input value={formData.slug || ""} onChange={e => handleChange("slug", e.target.value)} />
          </div>
          <div>
            <FieldLabel>SKU</FieldLabel>
            <Input value={formData.sku || ""} onChange={e => handleChange("sku", e.target.value)} />
          </div>
          <div>
            <FieldLabel>Price</FieldLabel>
            <Input type="number" value={formData.price || ""} onChange={e => handleChange("price", parseFloat(e.target.value))} />
          </div>
          <div>
            <FieldLabel>Sale Price</FieldLabel>
            <Input type="number" value={formData.salePrice || ""} onChange={e => handleChange("salePrice", parseFloat(e.target.value))} />
          </div>
          <div>
            <FieldLabel>Stock</FieldLabel>
            <Input type="number" value={formData.totalStock || ""} onChange={e => handleChange("totalStock", parseInt(e.target.value))} />
          </div>
          <div>
            <FieldLabel>Weight (grams)</FieldLabel>
            <Input type="number" value={formData.weight || ""} onChange={e => handleChange("weight", parseInt(e.target.value))} />
          </div>
          <div>
            <FieldLabel>Brand</FieldLabel>
            <Input value={formData.brand || ""} onChange={e => handleChange("brand", e.target.value)} />
          </div>
          <MultiSelect options={allCategories} selected={formData.categories || []} label="Categories" onChange={(value) => handleChange("categories", value)} />
          <div>
            <FieldLabel>Tags (comma separated)</FieldLabel>
            <Textarea value={formData.tags?.join(", ") || ""} onChange={e => handleChange("tags", e.target.value.split(",").map(tag => tag.trim()).filter(Boolean))} />
          </div>
          
          <div>
            <FieldLabel>Meta Title</FieldLabel>
            <Textarea value={formData.seo.metaTitle || ""} onChange={e => handleNestedChange("seo", "metaTitle", e.target.value)} />
          </div>
          <div>
            <FieldLabel>Meta Description</FieldLabel>
            <Textarea value={formData.seo.metaDescription || ""} onChange={e => handleNestedChange("seo", "metaDescription", e.target.value)} />
          </div>
          <div>
            <FieldLabel>Focus Keyword</FieldLabel>
            <Input value={formData.seo.focusKeyword || ""} onChange={e => handleNestedChange("seo", "focusKeyword", e.target.value)} />
          </div>
          <div>
            <FieldLabel>Related Product IDs</FieldLabel>
            <Textarea value={formData.relatedProductIds?.join(", ") || ""} onChange={e => handleChange("relatedProductIds", e.target.value.split(",").map(Number).filter(Boolean))} />
          </div>
          <div>
            <FieldLabel>Upsell Product IDs</FieldLabel>
            <Textarea value={formData.upsellProductIds?.join(", ") || ""} onChange={e => handleChange("upsellProductIds", e.target.value.split(",").map(Number).filter(Boolean))} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox checked={formData.isActive || false} onCheckedChange={val => handleChange("isActive", val)} />
            <label>Active</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox checked={formData.isFeatured || false} onCheckedChange={val => handleChange("isFeatured", val)} />
            <label>Featured</label>
          </div>
        </div>
      </div>
    </div>
  );
}