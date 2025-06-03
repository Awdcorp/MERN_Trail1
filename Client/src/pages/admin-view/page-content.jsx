import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Tabs, TabsList, TabsTrigger, TabsContent
} from "@/components/ui/tabs";
import {
  Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card";

const defaultPages = [
  { slug: "contact", label: "Contact Page" },
  { slug: "about", label: "About Page" },
  { slug: "privacy-policy", label: "Privacy Policy" },
  { slug: "terms-and-conditions", label: "Terms & Conditions" },
];

const fieldConfig = {
  contact: ["email", "phone", "address", "description", "mapSrc"],
  about: ["description"],
  "privacy-policy": ["description"],
  "terms-and-conditions": ["description"],
};

export default function AdminPageContent() {
  const [activeSlug, setActiveSlug] = useState("contact");
  const [formData, setFormData] = useState({});
  const { toast } = useToast();

  useEffect(() => {
    fetchPageContent(activeSlug);
  }, [activeSlug]);

  const fetchPageContent = async (slug) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/page-content/${slug}`,
        { withCredentials: true }
      );
      setFormData(res.data.data.fields || {});
    } catch {
      setFormData({});
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/page-content/${activeSlug}`,
        {
          title: defaultPages.find((p) => p.slug === activeSlug)?.label || "",
          fields: formData,
        },
        { withCredentials: true }
      );
      toast({ title: "Saved successfully" });
    } catch (err) {
      toast({ variant: "destructive", title: "Save failed" });
    }
  };

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-5xl p-6 mx-auto">
      <h2 className="text-2xl font-semibold mb-4">📝 Manage Static Page Content</h2>
      <Tabs value={activeSlug} onValueChange={setActiveSlug} className="space-y-6">
        <TabsList>
          {defaultPages.map((p) => (
            <TabsTrigger key={p.slug} value={p.slug}>
              {p.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {defaultPages.map((p) => (
          <TabsContent key={p.slug} value={p.slug}>
            <Card>
              <CardHeader>
                <CardTitle>{p.label}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {fieldConfig[p.slug].includes("email") && (
                  <Input
                    placeholder="Email"
                    value={formData.email || ""}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                )}
                {fieldConfig[p.slug].includes("phone") && (
                  <Input
                    placeholder="Phone"
                    value={formData.phone || ""}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                )}
                {fieldConfig[p.slug].includes("address") && (
                  <Textarea
                    placeholder="Address"
                    value={formData.address || ""}
                    onChange={(e) => handleChange("address", e.target.value)}
                  />
                )}
                {fieldConfig[p.slug].includes("description") && (
                  <Textarea
                    placeholder="Description / Message"
                    value={formData.description || ""}
                    onChange={(e) => handleChange("description", e.target.value)}
                  />
                )}
                {fieldConfig[p.slug].includes("mapSrc") && (
                  <Textarea
                    placeholder="Map Embed Src or Extra"
                    value={formData.mapSrc || ""}
                    onChange={(e) => handleChange("mapSrc", e.target.value)}
                  />
                )}
                <Button onClick={handleSave}>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
