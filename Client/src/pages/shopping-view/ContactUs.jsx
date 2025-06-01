import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function ContactUs() {
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [pageContent, setPageContent] = useState({});

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/page-content/contact`, {
        withCredentials: true,
      })
      .then((res) => {
        setPageContent(res.data?.data?.fields || {});
      });
  }, []);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/contact-message`,
        formData,
        { withCredentials: true }
      );

      toast({ title: "Message sent!", description: "We’ll get back to you shortly." });
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      toast({ title: "Failed to send message", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-[#1f2937]">
      <h1 className="text-3xl font-semibold mb-6 text-center">Contact Us</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
          />
          <Input
            name="email"
            type="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
          />
          <Textarea
            name="message"
            placeholder="Your Message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </Button>
        </form>

        {/* Contact Info */}
        <div className="space-y-4 text-sm text-gray-600">
          <div>
            <p className="font-semibold text-[#1f2937]">Email</p>
            <p>{pageContent.email || "info@example.com"}</p>
          </div>
          <div>
            <p className="font-semibold text-[#1f2937]">Phone</p>
            <p>{pageContent.phone || "N/A"}</p>
          </div>
          <div>
            <p className="font-semibold text-[#1f2937]">Address</p>
            <p>{pageContent.address || "Your Address"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
