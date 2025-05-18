import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    },
  });

  const [slugPreview, setSlugPreview] = useState("https://partyworld.ae");

  const fetchSettings = async () => {
    try {
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
        },
      });
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
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/settings`, formData);
      toast({ title: "✅ Settings updated successfully" });

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
        },
      });
    } catch (err) {
      console.error("❌ Failed to update settings:", err);
      toast({ title: "Error updating settings", variant: "destructive" });
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <div className="max-w-5xl p-6 mx-auto">
      <h2 className="text-2xl font-semibold mb-4">🔧 SEO Management Panel</h2>

      <Tabs defaultValue="homepage" className="space-y-6">
        <TabsList className="w-fit">
          <TabsTrigger value="homepage">Homepage</TabsTrigger>
          <TabsTrigger value="category">Category</TabsTrigger>
          <TabsTrigger value="product">Product</TabsTrigger>
        </TabsList>

        <TabsContent value="homepage">
          <Card>
            <CardHeader>
              <CardTitle>Homepage SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Meta Title</label>
                <Input
                  value={formData.homepageSeo.metaTitle}
                  onChange={(e) => handleHomepageChange("metaTitle", e.target.value)}
                />
                <div className="text-sm text-muted-foreground text-right">
                  {formData.homepageSeo.metaTitle.length}/60 characters
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Meta Description</label>
                <Textarea
                  rows={3}
                  value={formData.homepageSeo.metaDescription}
                  onChange={(e) => handleHomepageChange("metaDescription", e.target.value)}
                />
                <div className="text-sm text-muted-foreground text-right">
                  {formData.homepageSeo.metaDescription.length}/160 characters
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">OG Image URL</label>
                <Input
                  value={formData.homepageSeo.ogImage}
                  onChange={(e) => handleHomepageChange("ogImage", e.target.value)}
                />
              </div>

              <div className="border rounded-md p-4 bg-muted/50">
                <div className="text-xs text-muted-foreground uppercase mb-1">Google Preview</div>
                <div className="text-blue-800 text-sm">
                  {formData.homepageSeo.metaTitle || "PartyWorld | Best Party Store in UAE"}
                </div>
                <div className="text-xs text-green-700 mb-1">
                  {slugPreview}/
                </div>
                <div className="text-sm text-gray-700 line-clamp-2">
                  {formData.homepageSeo.metaDescription || "Find the best party supplies, decorations, costumes, and more at PartyWorld UAE."}
                </div>
              </div>

              <h4 className="text-md font-semibold pt-6">Structured Data (Organization Info)</h4>

              <div>
                <label className="block text-sm font-medium mb-1">Organization Name</label>
                <Input
                  value={formData.organization.name}
                  onChange={(e) => handleOrgChange("name", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Organization URL</label>
                <Input
                  value={formData.organization.url}
                  onChange={(e) => handleOrgChange("url", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Organization Logo URL</label>
                <Input
                  value={formData.organization.logo}
                  onChange={(e) => handleOrgChange("logo", e.target.value)}
                />
              </div>

              <Button onClick={handleSubmit} className="mt-4">
                Save Homepage SEO
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="category">
          <Card>
            <CardHeader>
              <CardTitle>Category SEO (Coming Soon)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm italic">
                Category-level SEO editing will be added soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="product">
          <Card>
            <CardHeader>
              <CardTitle>Product SEO (Editor-level)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm italic">
                Product-level SEO editing is available inside the product editor.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
