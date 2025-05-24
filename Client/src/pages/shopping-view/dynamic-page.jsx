import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PublicSectionRenderer from "@/components/shopping-view/PublicSectionRenderer";

import { Settings } from "lucide-react";

export default function DynamicPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [error, setError] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/pages/${slug}`)
      .then((res) => setPage(res.data))
      .catch(() => setError("Page not found"));
  }, [slug]);

  if (error) return <div className="p-10 text-red-500">{error}</div>;
  if (!page) return <div className="p-10">Loading...</div>;

  return (
    <div className="relative min-h-screen bg-white">

      {/* Page Content */}
      <div className={`transition-all ${showSidebar ? "mr-[320px]" : ""}`}>
        <h1 className="text-center text-2xl font-bold py-6">{page.title}</h1>

        <div className="flex flex-col gap-10 pb-10 max-w-5xl mx-auto px-4">
          {Array.isArray(page.blocks) && page.blocks.length > 0 ? (
            page.blocks.map((block, idx) => (
              <div key={idx}>
                <PublicSectionRenderer type={block.type} data={block.data} />
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 text-sm">No blocks found.</div>
          )}
        </div>
      </div>

    </div>
  );
}
