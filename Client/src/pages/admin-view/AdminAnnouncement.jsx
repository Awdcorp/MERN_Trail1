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
            .get(`${import.meta.env.VITE_API_URL}/api/admin/announcement/active`)
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
            {/* ✅ Full-width preview bar on top */}
            {formData.isActive && (
                <div
                    className="text-xs md:text-sm py-3 w-full"
                    style={{
                        backgroundColor: formData.backgroundColor,
                        color: formData.textColor,
                    }}
                >
                    <div className="max-w-full px-4">
                        <div className="flex flex-col md:flex-row md:justify-between items-center gap-2 text-center md:text-left">
                            <span>{formData.leftText || "Left Text Preview"}</span>
                            <span>{formData.rightText || "Right Text Preview"}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* ✅ Centered admin form content */}
            <div className="max-w-2xl mx-auto space-y-6 p-6">
                <h2 className="text-xl font-bold text-[#463970]">Announcement Banner Settings</h2>

                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Left Text</label>
                    <Input
                        value={formData.leftText}
                        onChange={(e) => handleChange("leftText", e.target.value)}
                        placeholder="Example: 10% OFF FIRST ORDER: USE CODE HELLOPW"
                    />
                </div>

                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Right Text</label>
                    <Input
                        value={formData.rightText}
                        onChange={(e) => handleChange("rightText", e.target.value)}
                        placeholder="Example: FREE DELIVERIES IN UAE ON ORDERS OVER AED 200"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Checkbox
                        checked={formData.isActive}
                        onCheckedChange={(val) => handleChange("isActive", val)}
                    />
                    <label className="text-sm">Show Announcement</label>
                </div>

                <div className="flex gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Background Color</label>
                        <Input
                            type="color"
                            value={formData.backgroundColor}
                            onChange={(e) => handleChange("backgroundColor", e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Text Color</label>
                        <Input
                            type="color"
                            value={formData.textColor}
                            onChange={(e) => handleChange("textColor", e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Start Date</label>
                        <Input
                            type="datetime-local"
                            value={formData.startDate?.slice(0, 16) || ""}
                            onChange={(e) => handleChange("startDate", e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">End Date</label>
                        <Input
                            type="datetime-local"
                            value={formData.endDate?.slice(0, 16) || ""}
                            onChange={(e) => handleChange("endDate", e.target.value)}
                        />
                    </div>
                </div>

                <Button onClick={handleSave}>Save Announcement</Button>
            </div>
        </>
    );
}
