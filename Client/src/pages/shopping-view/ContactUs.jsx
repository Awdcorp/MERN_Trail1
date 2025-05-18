import { useState } from "react";
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

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }

    // You can later send this to backend or email API
    setLoading(true);
    setTimeout(() => {
      toast({ title: "Message sent!", description: "We’ll get back to you shortly." });
      setFormData({ name: "", email: "", message: "" });
      setLoading(false);
    }, 1000);
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
            <p>info@alrahmaniamobile.com</p>
          </div>
          <div>
            <p className="font-semibold text-[#1f2937]">Phone</p>
            <p>+971 56 747 4593</p>
            <p>+971 56 907 4775</p>
          </div>
          <div>
            <p className="font-semibold text-[#1f2937]">Address</p>
            <p>Al Rahmania Mobile Store, Dubai, UAE</p>
          </div>
        </div>
      </div>
    </div>
  );
}
