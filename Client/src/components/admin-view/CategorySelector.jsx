import { useEffect, useState } from "react";
import axios from "axios";

export default function CategorySelector({
  selected = [],
  onChange,
  title = "Categories",
  compact = false,
}) {
  const [allCategories, setAllCategories] = useState({});

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/categories/flat-with-path`).then((res) => {
      const flat = res.data;
      const tree = {};

      flat.forEach((cat) => {
        const parts = cat.label.split(" > ");
        const [level0, level1, ...rest] = parts;
        const displayLabel = rest.length ? rest.join(" > ") : level1 || level0;

        if (!tree[level0]) tree[level0] = {};

        if (level1) {
          if (!tree[level0][level1]) tree[level0][level1] = [];
          tree[level0][level1].push({ ...cat, displayLabel });
        } else {
          if (!tree[level0]["__flat__"]) tree[level0]["__flat__"] = [];
          tree[level0]["__flat__"].push({ ...cat, displayLabel });
        }
      });

      setAllCategories(tree);
    });
  }, []);

  const handleToggle = (value, checked) => {
    const next = checked
      ? [...selected, value]
      : selected.filter((v) => v !== value);
    onChange(next);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{title}</label>

      {selected.length > 0 && (
        <div className={compact ? "flex flex-wrap gap-1 mb-2" : "flex flex-wrap gap-2 mb-4"}>
          {Object.entries(allCategories).flatMap(([group, subGroups]) =>
            Object.entries(subGroups).flatMap(([subGroupKey, items]) =>
              (Array.isArray(items) ? items : [])
                .filter((item) => selected.includes(item.value))
                .map((item) => (
                  <div
                    key={item.value}
                    className={`flex items-center bg-gray-200 text-sm rounded-full px-3 py-1 ${
                      compact ? "text-xs" : ""
                    }`}
                  >
                    <span className="mr-2">
                      {(() => {
                        if (subGroupKey === "__flat__") return item.displayLabel;
                        if (subGroupKey === item.displayLabel) return `${group} > ${item.displayLabel}`;
                        return `${group} > ${subGroupKey} > ${item.displayLabel}`;
                      })()}
                    </span>
                    <button
                      onClick={() => handleToggle(item.value, false)}
                      className="text-red-500 hover:text-red-700 font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))
            )
          )}
        </div>
      )}

      <div
        className={`space-y-4 border p-4 bg-white rounded overflow-y-auto ${
          compact ? "max-h-72" : "max-h-96"
        }`}
      >
        {Object.entries(allCategories).map(([level0, subGroups]) => (
          <div key={level0}>
            {(subGroups["__flat__"] || []).length > 0 && (
              <div
                className={`ml-4 ${
                  compact ? "grid grid-cols-2 gap-1" : "grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2"
                }`}
              >
                {subGroups["__flat__"].map((item) => (
                  <label key={item.value} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selected.includes(item.value)}
                      onChange={(e) => handleToggle(item.value, e.target.checked)}
                    />
                    <span>{item.displayLabel}</span>
                  </label>
                ))}
              </div>
            )}

            {Object.entries(subGroups)
              .filter(([k]) => k !== "__flat__")
              .map(([level1, items]) => {
                const headingItem = items.find((i) => i.displayLabel === level1);
                const childItems = items.filter((i) => i.displayLabel !== level1);
                return (
                  <div key={level1} className="ml-6 mt-2">
                    <div className="flex items-center space-x-2 text-sm font-medium text-gray-500 mb-1">
                      {headingItem && (
                        <input
                          type="checkbox"
                          checked={selected.includes(headingItem.value)}
                          onChange={(e) =>
                            handleToggle(headingItem.value, e.target.checked)
                          }
                        />
                      )}
                      <span>{level1}</span>
                    </div>
                    <div
                      className={`ml-6 ${
                        compact ? "grid grid-cols-2 gap-1" : "grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4"
                      }`}
                    >
                      {childItems.map((item) => (
                        <label
                          key={item.value}
                          className="flex items-center space-x-2 text-sm"
                        >
                          <input
                            type="checkbox"
                            checked={selected.includes(item.value)}
                            onChange={(e) =>
                              handleToggle(item.value, e.target.checked)
                            }
                          />
                          <span>{item.displayLabel}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        ))}
      </div>
    </div>
  );
}
