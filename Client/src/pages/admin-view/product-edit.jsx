import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import ImageMultiUpload from "@/components/admin-view/image-multi-upload";
import { useToast } from "@/components/ui/use-toast";
import { Pencil } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import CategorySelector from "@/components/admin-view/CategorySelector"; // ✅ imported

export default function AdminProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const isCreateMode = id === "new";

  const [formData, setFormData] = useState(null);
  const [editSEO, setEditSEO] = useState(false);

  useEffect(() => {
    if (isCreateMode) {
      setFormData({
        title: "",
        slug: "",
        description: "",
        shortDescription: "",
        sku: "",
        price: 0,
        salePrice: 0,
        totalStock: 0,
        weight: 0,
        brand: "",
        tags: [],
        images: [],
        categories: [],
        relatedProductIds: [],
        upsellProductIds: [],
        seo: { metaTitle: "", metaDescription: "", focusKeyword: "" },
        isActive: true,
        isFeatured: false,
      });
    } else {
      axios.get(`${import.meta.env.VITE_API_URL}/api/admin/products/${id}`).then((res) => {
        if (res.data.success) {
          const product = res.data.data;
          const normalized = {
            ...product,
            categories: (product.categories || []).map((c) =>
              typeof c === "object" ? c._id : c
            ),
            tags: product.tags || [],
            seo: product.seo || {
              metaTitle: "",
              metaDescription: "",
              focusKeyword: "",
            },
            variants: product.variants || [],
            attributes: product.attributes || [],
            upsellProductIds: product.upsellProductIds || [],
            relatedProductIds: product.relatedProductIds || [],
          };
          setFormData(normalized);
        }
      });
    }
  }, [id]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const FieldLabel = ({ children }) => (
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {children}
    </label>
  );

  const handleSubmit = async () => {
    try {
      const endpoint = isCreateMode
        ? `${import.meta.env.VITE_API_URL}/api/admin/products/add`
        : `${import.meta.env.VITE_API_URL}/api/admin/products/edit/${id}`;
      const method = isCreateMode ? axios.post : axios.put;

      const res = await method(endpoint, formData);
      if (res.data.success) {
        toast({
          title: isCreateMode
            ? "✅ Product created successfully"
            : "✅ Product updated successfully",
          variant: "success",
        });
        navigate("/admin/products");
      }
    } catch (err) {
      toast({
        title: `❌ Failed to ${isCreateMode ? "create" : "update"} product`,
        variant: "destructive",
      });
    }
  };

  if (!formData) {
    return <div className="p-6 text-gray-500 animate-pulse">Loading product form...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{isCreateMode ? "Create Product" : "Edit Product"}</h2>
        <Button onClick={handleSubmit}>Save</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <FieldLabel>Title</FieldLabel>
          <Input value={formData.title || ""} onChange={(e) => handleChange("title", e.target.value)} />

          <FieldLabel>Description</FieldLabel>
          <ReactQuill
            theme="snow"
            value={formData.description || ""}
            onChange={(value) => handleChange("description", value)}
            className="bg-white"
          />

          <FieldLabel>Short Description</FieldLabel>
          <Textarea
            value={formData.shortDescription || ""}
            onChange={(e) => handleChange("shortDescription", e.target.value)}
          />

          <ImageMultiUpload
            images={formData.images || []}
            onChange={(imgs) => handleChange("images", imgs)}
          />

          <FieldLabel>Slug</FieldLabel>
          <Input value={formData.slug || ""} onChange={(e) => handleChange("slug", e.target.value)} />

          <FieldLabel>SKU</FieldLabel>
          <Input value={formData.sku || ""} onChange={(e) => handleChange("sku", e.target.value)} />

          <FieldLabel>Price</FieldLabel>
          <Input
            type="number"
            value={formData.price || ""}
            onChange={(e) => handleChange("price", parseFloat(e.target.value))}
          />

          <FieldLabel>Sale Price</FieldLabel>
          <Input
            type="number"
            value={formData.salePrice || ""}
            onChange={(e) => handleChange("salePrice", parseFloat(e.target.value))}
          />

          <FieldLabel>Stock</FieldLabel>
          <Input
            type="number"
            value={formData.totalStock || ""}
            onChange={(e) => handleChange("totalStock", parseInt(e.target.value))}
          />

          <FieldLabel>Weight (grams)</FieldLabel>
          <Input
            type="number"
            value={formData.weight || ""}
            onChange={(e) => handleChange("weight", parseInt(e.target.value))}
          />

          <FieldLabel>Brand</FieldLabel>
          <Input value={formData.brand || ""} onChange={(e) => handleChange("brand", e.target.value)} />

          {/* ✅ REPLACED full category section with reusable */}
          <CategorySelector
            selected={formData.categories}
            onChange={(val) => handleChange("categories", val)}
          />

          <FieldLabel>Tags (comma separated)</FieldLabel>
          <Textarea
            value={formData.tags?.join(", ") || ""}
            onChange={(e) =>
              handleChange(
                "tags",
                e.target.value.split(",").map((tag) => tag.trim()).filter(Boolean)
              )
            }
          />

          <div className="space-y-2 border rounded-lg p-4 shadow-sm bg-white">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Search engine listing</h3>
              <button
                className="text-sm text-blue-600 hover:underline inline-flex items-center"
                onClick={() => setEditSEO(!editSEO)}
              >
                <Pencil className="w-4 h-4 mr-1" /> Edit
              </button>
            </div>
            <div className="text-sm text-muted-foreground">Preview:</div>
            <div className="mt-1 text-sm">
              <p className="text-blue-600 underline">
                https://yourdomain.com/products/{formData.slug}
              </p>
              <p className="font-semibold">{formData.seo.metaTitle}</p>
              <p>{formData.seo.metaDescription}</p>
            </div>

            {editSEO && (
              <div className="space-y-3 mt-4">
                <div>
                  <FieldLabel>Page Title</FieldLabel>
                  <Input
                    value={formData.seo.metaTitle || ""}
                    onChange={(e) => handleNestedChange("seo", "metaTitle", e.target.value)}
                  />
                </div>
                <div>
                  <FieldLabel>Meta Description</FieldLabel>
                  <Textarea
                    value={formData.seo.metaDescription || ""}
                    onChange={(e) => handleNestedChange("seo", "metaDescription", e.target.value)}
                  />
                </div>
                <div>
                  <FieldLabel>Focus Keyword</FieldLabel>
                  <Input
                    value={formData.seo.focusKeyword || ""}
                    onChange={(e) => handleNestedChange("seo", "focusKeyword", e.target.value)}
                  />
                </div>
                <div>
                  <FieldLabel>URL Handle</FieldLabel>
                  <Input value={formData.slug || ""} onChange={(e) => handleChange("slug", e.target.value)} />
                </div>
              </div>
            )}
          </div>

          <FieldLabel>Related Product IDs</FieldLabel>
          <Textarea
            value={formData.relatedProductIds?.join(", ") || ""}
            onChange={(e) =>
              handleChange(
                "relatedProductIds",
                e.target.value.split(",").map(Number).filter(Boolean)
              )
            }
          />

          <FieldLabel>Upsell Product IDs</FieldLabel>
          <Textarea
            value={formData.upsellProductIds?.join(", ") || ""}
            onChange={(e) =>
              handleChange(
                "upsellProductIds",
                e.target.value.split(",").map(Number).filter(Boolean)
              )
            }
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={formData.isActive || false}
              onCheckedChange={(val) => handleChange("isActive", val)}
            />
            <label>Active</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={formData.isFeatured || false}
              onCheckedChange={(val) => handleChange("isFeatured", val)}
            />
            <label>Featured</label>
          </div>
        </div>
      </div>
    </div>
  );
}
