import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const knownFields = [
  "title", "slug", "description", "price", "salePrice", "totalStock", "brand",
  "isActive", "isFeatured", "categories", "tags", "sku"
];

export default function CSVPreviewModal({ previewData, onClose, onConfirm }) {
  const [fieldMapping, setFieldMapping] = useState({});

  useEffect(() => {
    if (previewData?.headers) {
      const defaultMapping = {};
      previewData.headers.forEach((header) => {
        const match = knownFields.find((f) =>
          header.toLowerCase().includes(f.toLowerCase())
        );
        defaultMapping[header] = match || "";
      });
      setFieldMapping(defaultMapping);
      console.log("🧩 Default field mapping:", defaultMapping);
    }
  }, [previewData]);

  const handleConfirm = () => {
    console.log("✅ Confirming import with mapping:", fieldMapping);
    onConfirm(fieldMapping);
  };

  if (!previewData?.headers || !previewData?.sample) {
    console.warn("⚠️ Preview data incomplete:", previewData);
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-[90vw] max-w-[1280px] max-h-[85vh] overflow-hidden shadow-xl">
        <h2 className="text-xl font-semibold mb-4">CSV Preview</h2>

        <div className="overflow-auto border rounded">
          <table className="min-w-full text-sm border-collapse">
            <thead className="sticky top-0 bg-white z-10">
              <tr>
                {previewData.headers.map((header, idx) => (
                  <th key={idx} className="border px-3 py-2 text-left min-w-[150px]">
                    <div className="font-medium mb-1">{header}</div>
                    <select
                      value={fieldMapping[header] || ""}
                      onChange={(e) =>
                        setFieldMapping({
                          ...fieldMapping,
                          [header]: e.target.value,
                        })
                      }
                      className="text-sm border rounded px-2 py-1 w-full"
                    >
                      <option value="">-- skip --</option>
                      {knownFields.map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {previewData.sample.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-t">
                  {row.map((cell, i) => (
                    <td
                      key={i}
                      className="border px-3 py-2 text-muted-foreground max-w-[300px] truncate"
                      title={typeof cell === "string" ? cell : ""}
                    >
                      {typeof cell === "string" && cell.length > 200
                        ? `${cell.slice(0, 200)}...`
                        : cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleConfirm}>Import</Button>
        </div>
      </div>
    </div>
  );
}
