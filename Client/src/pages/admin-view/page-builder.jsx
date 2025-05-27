import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import GenericPageBuilder from "./GenericPageBuilder";
import axios from "axios";

export default function PageBuilder() {
  const [params] = useSearchParams();
  const type = params.get("type");
  const id = params.get("id");

  const [fetchUrl, setFetchUrl] = useState("");
  const [saveUrl, setSaveUrl] = useState("");
  const [slug, setSlug] = useState(null); // 👉 used for preview link
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!type) {
      setError("Missing `type` query parameter");
      return;
    }

    if (type === "homepage") {
      const url = `${import.meta.env.VITE_API_URL}/api/admin/homepage-layout`;
      setFetchUrl(url);
      setSaveUrl(url);
      setSlug("/"); // homepage → preview goes to /
    } else if (type === "page" && id) {
      const url = `${import.meta.env.VITE_API_URL}/api/admin/pages/${id}`;
      setFetchUrl(url);
      setSaveUrl(url);

      // 🔍 Fetch the page slug from the backend
      axios.get(url)
        .then(res => {
          const s = res.data?.slug;
          if (s) {
            setSlug(`${s}`);
          } else {
            setError("Page is missing slug");
          }
        })
        .catch(() => setError("Failed to load page data"));
    } else {
      setError("Invalid page builder URL parameters");
    }
  }, [type, id]);

  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!fetchUrl || !saveUrl) return null;

  return (
    <GenericPageBuilder
      fetchUrl={fetchUrl}
      saveUrl={saveUrl}
      slug={slug}
    />
  );
}
