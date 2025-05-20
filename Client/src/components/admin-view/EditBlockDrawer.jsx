import { useEffect, useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EditBlockDrawer({ open, block, onSave, onClose }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    setFormData(block?.data || {});
  }, [block]);

  if (!block) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData((prev) => {
      const copy = [...(prev[field] || [])];
      copy[index] = value;
      return { ...prev, [field]: copy };
    });
  };

  const addToArray = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), ""]
    }));
  };

  const removeFromArray = (field, index) => {
    setFormData((prev) => {
      const copy = [...(prev[field] || [])];
      copy.splice(index, 1);
      return { ...prev, [field]: copy };
    });
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
            <label className="text-sm font-medium">Phones</label>
            {(formData.phones || []).map((phone, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <Input value={phone} onChange={(e) => handleArrayChange("phones", i, e.target.value)} />
                <Button variant="outline" onClick={() => removeFromArray("phones", i)}>-</Button>
              </div>
            ))}
            <Button size="sm" onClick={() => addToArray("phones")}>+ Add Phone</Button>

            <label className="text-sm font-medium mt-4 block">WhatsApp</label>
            {(formData.whatsapp || []).map((wa, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <Input value={wa} onChange={(e) => handleArrayChange("whatsapp", i, e.target.value)} />
                <Button variant="outline" onClick={() => removeFromArray("whatsapp", i)}>-</Button>
              </div>
            ))}
            <Button size="sm" onClick={() => addToArray("whatsapp")}>+ Add WhatsApp</Button>

            <label className="text-sm font-medium mt-4 block">Button Text</label>
            <Input value={formData.buttonText || ""} onChange={(e) => handleChange("buttonText", e.target.value)} className="mb-4" />

            <label className="text-sm font-medium">Button Link</label>
            <Input value={formData.buttonLink || ""} onChange={(e) => handleChange("buttonLink", e.target.value)} className="mb-4" />
          </>
        );

      default:
        return <div className="text-sm text-gray-500">This block has no editable fields yet.</div>;
    }
  };

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="p-6 max-w-md ml-auto">
        <DrawerHeader>
          <DrawerTitle>Edit Block: {block.type}</DrawerTitle>
        </DrawerHeader>

        <div className="space-y-4 max-h-[75vh] overflow-y-auto">
          {renderFields()}
        </div>

        <DrawerFooter className="mt-4">
          <Button onClick={() => onSave(block.key, formData)}>Save Changes</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
