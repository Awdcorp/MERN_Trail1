import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import LiveSectionRenderer from "@/components/admin-view/LiveSectionRenderer";
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
      {/* Toggle Button */}
      <button
        className="fixed top-4 right-4 z-40 bg-gray-800 text-white p-2 rounded-full shadow hover:bg-gray-700"
        onClick={() => setShowSidebar((prev) => !prev)}
      >
        <Settings size={18} />
      </button>

      {/* Page Content */}
      <div className={`transition-all ${showSidebar ? "mr-[320px]" : ""}`}>
        <h1 className="text-center text-2xl font-bold py-6">{page.title}</h1>

        <div className="flex flex-col gap-10 pb-10 max-w-5xl mx-auto px-4">
          {Array.isArray(page.blocks) && page.blocks.length > 0 ? (
            page.blocks.map((block, idx) => (
              <div key={idx}>
                <LiveSectionRenderer type={block.type} data={block.data} />
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 text-sm">No blocks found.</div>
          )}
        </div>
      </div>

      {/* Fixed Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-[320px] border-l bg-white p-6 shadow-lg transition-transform duration-300 z-30 ${
          showSidebar ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <h2 className="text-lg font-semibold mb-4">Page Settings</h2>
        <div className="text-sm text-gray-600">
          <p>Slug: <strong>{page.slug}</strong></p>
          <p>Status: <strong>{page.status}</strong></p>
          <p className="mt-4 text-gray-400 italic">Sidebar ready for future SEO/meta settings.</p>
        </div>
      </aside>
    </div>
  );
}
