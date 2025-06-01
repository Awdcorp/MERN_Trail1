import { useEffect, useState } from "react";
import axios from "axios";

export default function PrivacyPolicyPage() {
  const [content, setContent] = useState("");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/page-content/privacy-policy`)
      .then((res) => {
        setContent(res.data?.data?.fields?.description || "");
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold mb-4">Privacy Policy</h1>
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
