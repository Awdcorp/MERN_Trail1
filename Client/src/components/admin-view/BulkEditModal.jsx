import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { useDispatch } from "react-redux";
import { bulkUpdateProducts, fetchAllProducts } from "@/store/admin/products-slice";

export default function BulkEditModal({ open, onClose, selectedIds, page, limit, search, category, sortBy, sortOrder }) {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const [form, setForm] = useState({
    brand: "",
    price: "",
    salePrice: "",
    totalStock: "",
    isActive: "",
    isFeatured: false,
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const updates = {};
    Object.entries(form).forEach(([key, val]) => {
      if (val !== "" && val !== null && val !== undefined) updates[key] = val;
    });

    dispatch(bulkUpdateProducts({ ids: selectedIds, updates }))
      .unwrap()
      .then(() => {
        toast({ title: "Products updated successfully" });
        dispatch(fetchAllProducts({ page, limit, search, category, sortBy, sortOrder }));
        onClose();
      });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Edit Products</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 py-4">
          <Input
            placeholder="Brand"
            value={form.brand}
            onChange={(e) => handleChange("brand", e.target.value)}
          />

          <Input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) => handleChange("price", parseFloat(e.target.value))}
          />

          <Input
            type="number"
            placeholder="Sale Price"
            value={form.salePrice}
            onChange={(e) => handleChange("salePrice", parseFloat(e.target.value))}
          />

          <Input
            type="number"
            placeholder="Total Stock"
            value={form.totalStock}
            onChange={(e) => handleChange("totalStock", parseInt(e.target.value))}
          />

          <select
            className="border rounded px-3 py-2 text-sm"
            value={form.isActive}
            onChange={(e) => handleChange("isActive", e.target.value === "true")}
          >
            <option value="">-- Select Status --</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          <label className="flex items-center gap-2">
            <Checkbox
              checked={form.isFeatured}
              onCheckedChange={(val) => handleChange("isFeatured", val)}
            />
            Featured
          </label>
        </div>

        <div className="flex justify-end pt-6">
          <Button variant="outline" onClick={onClose} className="mr-4">
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Apply Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
