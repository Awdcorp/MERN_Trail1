// File: Client/src/components/admin-view/ProductSearchSelector.jsx

import { useEffect, useState } from "react";
import axios from "axios";

export default function ProductSearchSelector({ value = [], onChange }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchQuery.length > 1) {
        console.log("🔍 Searching:", searchQuery);
        axios
          .get(`${import.meta.env.VITE_API_URL}/api/products/search?query=${searchQuery}`)
          .then((res) => {
            console.log("✅ Results:", res.data);
            if (res.data?.success) setSearchResults(res.data.data);
          })
          .catch((err) => {
            console.error("❌ Failed search:", err);
          });
      } else {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [searchQuery]);

  const handleAdd = (product) => {
    if (!value.includes(product._id)) {
      onChange([...value, product._id]);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const handleRemove = (id) => {
    onChange(value.filter((v) => v !== id));
  };

  return (
    <div className="space-y-2">
      <input
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full border rounded px-3 py-2"
      />

      {searchResults.length > 0 && (
        <ul className="border rounded bg-white divide-y max-h-48 overflow-y-auto">
          {searchResults.map((p) => (
            <li
              key={p._id}
              onClick={() => handleAdd(p)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {p.title} – AED {p.price}
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap gap-2">
        {value.map((id) => {
          const p = searchResults.find((p) => p._id === id) || {};
          return (
            <div
              key={id}
              className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2"
            >
              <span>{p.title || id}</span>
              <button
                type="button"
                onClick={() => handleRemove(id)}
                className="text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
