import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function AdminAnnouncement() {
    const [formData, setFormData] = useState({
        startDate: null,
        endDate: null,
        leftText: "",
        rightText: "",
        isActive: true,
        backgroundColor: "#00B0BA",
        textColor: "#FFFFFF",
    });
    const { toast } = useToast();

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_API_URL}/api/admin/announcement/latest`)
            .then((res) => {
                if (res.data) {
                    setFormData(res.data);
                }
            })
            .catch(() => toast({ title: "Failed to fetch announcement data" }));
    }, []);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        axios
            .post(`${import.meta.env.VITE_API_URL}/api/admin/announcement/set`, formData)
            .then(() => {
                toast({ title: "Announcement updated successfully ✅" });
            })
            .catch(() => {
                toast({ title: "Failed to update announcement ❌" });
            });
    };

    return (
  <>
    {/* Preview Bar */}
    {formData.isActive && (
      <div
        className="text-xs md:text-sm py-3 px-4 w-full"
        style={{
          backgroundColor: formData.backgroundColor,
          color: formData.textColor,
        }}
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-center md:text-left max-w-6xl mx-auto">
          <span>{formData.leftText || "Left Text Preview"}</span>
          <span>{formData.rightText || "Right Text Preview"}</span>
        </div>
      </div>
    )}

    {/* Main Settings Panel */}
    <div className="max-w-4xl mx-auto mt-8 bg-white rounded-xl shadow border p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">🎯 Announcement Banner Settings</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Left Text</label>
          <Input
            value={formData.leftText}
            onChange={(e) => handleChange("leftText", e.target.value)}
            placeholder="e.g. 10% OFF FIRST ORDER: USE CODE HELLOPW"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Right Text</label>
          <Input
            value={formData.rightText}
            onChange={(e) => handleChange("rightText", e.target.value)}
            placeholder="e.g. FREE DELIVERY IN UAE ON ORDERS OVER AED 200"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Checkbox
          checked={formData.isActive}
          onCheckedChange={(val) => handleChange("isActive", val)}
          id="show"
        />
        <label htmlFor="show" className="text-sm text-gray-700">Show Announcement</label>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Background Color</label>
          <Input
            type="color"
            className="h-10 p-1"
            value={formData.backgroundColor}
            onChange={(e) => handleChange("backgroundColor", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Text Color</label>
          <Input
            type="color"
            className="h-10 p-1"
            value={formData.textColor}
            onChange={(e) => handleChange("textColor", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Start Date</label>
          <Input
            type="datetime-local"
            value={formData.startDate?.slice(0, 16) || ""}
            onChange={(e) => handleChange("startDate", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">End Date</label>
          <Input
            type="datetime-local"
            value={formData.endDate?.slice(0, 16) || ""}
            onChange={(e) => handleChange("endDate", e.target.value)}
          />
        </div>
      </div>

      <div className="pt-4">
        <Button className="w-full md:w-auto px-6 py-2" onClick={handleSave}>
          Save Announcement
        </Button>
      </div>
    </div>
  </>
);

}
