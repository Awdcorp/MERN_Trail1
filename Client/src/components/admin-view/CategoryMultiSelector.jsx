// File: Client/src/components/admin-view/CategoryMultiSelector.jsx

import { useEffect, useState } from "react";
import axios from "axios";

export default function CategoryMultiSelector({ value = [], onChange }) {
  const [allCategories, setAllCategories] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get(`/api/categories`).then((res) => {
      setAllCategories(res.data || []);
    });
  }, []);

  const filtered = allCategories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-2">
      <input
        type="text"
        placeholder="Search categories..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border rounded px-3 py-2"
      />

      <div className="flex flex-wrap gap-2">
        {value.map((id) => {
          const category = allCategories.find((c) => c._id === id);
          return (
            <div
              key={id}
              className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2"
            >
              <span>{category?.name || id}</span>
              <button
                type="button"
                onClick={() => onChange(value.filter((v) => v !== id))}
                className="text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>

      <div className="border rounded p-2 max-h-52 overflow-y-auto space-y-1">
        {filtered.map((cat) => (
          <label key={cat._id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={value.includes(cat._id)}
              onChange={(e) => {
                const checked = e.target.checked;
                onChange(
                  checked ? [...value, cat._id] : value.filter((id) => id !== cat._id)
                );
              }}
            />
            <span>{cat.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
