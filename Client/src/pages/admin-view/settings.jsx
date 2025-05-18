import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function AdminSEOSettingsPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    homepageSeo: {
      metaTitle: "",
      metaDescription: "",
      ogImage: "",
    },
    organization: {
      name: "",
      url: "",
      logo: "",
    }
  });

  const fetchSettings = async () => {
    try {
      console.log("📡 Fetching current SEO settings from backend...");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/settings`);
      const homepageSeo = res.data?.homepageSeo || {};
      const organization = res.data?.organization || {};

      setFormData({
        homepageSeo: {
          metaTitle: homepageSeo.metaTitle || "",
          metaDescription: homepageSeo.metaDescription || "",
          ogImage: homepageSeo.ogImage || "",
        },
        organization: {
          name: organization.name || "",
          url: organization.url || "",
          logo: organization.logo || "",
        }
      });

      console.log("✅ Settings loaded:", res.data);
    } catch (err) {
      console.error("❌ Failed to load settings:", err);
      toast({ title: "Error loading settings", variant: "destructive" });
    }
  };

  const handleHomepageChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      homepageSeo: {
        ...prev.homepageSeo,
        [field]: value,
      },
    }));
  };

  const handleOrgChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      organization: {
        ...prev.organization,
        [field]: value,
      },
    }));
  };

const handleSubmit = async () => {
  console.log("📤 Submitting updated SEO settings:", formData);
  try {
    const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/settings`, formData);
    toast({ title: "✅ Settings updated successfully" });

    // FIX: manually map response like fetchSettings does
    const homepageSeo = res.data?.homepageSeo || {};
    const organization = res.data?.organization || {};

    setFormData({
      homepageSeo: {
        metaTitle: homepageSeo.metaTitle || "",
        metaDescription: homepageSeo.metaDescription || "",
        ogImage: homepageSeo.ogImage || "",
      },
      organization: {
        name: organization.name || "",
        url: organization.url || "",
        logo: organization.logo || "",
      }
    });

    console.log("✅ Updated settings saved to backend:", res.data);
  } catch (err) {
    console.error("❌ Failed to update settings:", err);
    toast({ title: "Error updating settings", variant: "destructive" });
  }
};


  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <div className="max-w-3xl p-4 mx-auto space-y-6">
      <h2 className="text-xl font-bold">🌐 Homepage SEO Settings</h2>

      <div>
        <label className="block text-sm font-medium">Meta Title</label>
        <Input
          value={formData.homepageSeo.metaTitle}
          onChange={(e) => handleHomepageChange("metaTitle", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Meta Description</label>
        <Textarea
          rows={3}
          value={formData.homepageSeo.metaDescription}
          onChange={(e) => handleHomepageChange("metaDescription", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">OG Image URL</label>
        <Input
          value={formData.homepageSeo.ogImage}
          onChange={(e) => handleHomepageChange("ogImage", e.target.value)}
        />
      </div>

      <h3 className="text-lg font-semibold pt-6">Structured Data (Organization Info)</h3>

      <div>
        <label className="block text-sm font-medium">Organization Name</label>
        <Input
          value={formData.organization?.name || ""}
          onChange={(e) => handleOrgChange("name", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Organization URL</label>
        <Input
          value={formData.organization?.url || ""}
          onChange={(e) => handleOrgChange("url", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Organization Logo URL</label>
        <Input
          value={formData.organization?.logo || ""}
          onChange={(e) => handleOrgChange("logo", e.target.value)}
        />
      </div>

      <Button onClick={handleSubmit} className="mt-4">
        Save Settings
      </Button>
    </div>
  );
}
