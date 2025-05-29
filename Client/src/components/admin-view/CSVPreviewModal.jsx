import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const knownFields = [
  "title", "slug", "description", "shortDescription", "categories", "brand", "price",
  "salePrice", "totalStock", "weight", "sku", "tags", "images", "variants", "attributes",
  "relatedProductIds", "upsellProductIds", "isActive", "isFeatured", "externalId",
  "averageReview", "meta", "seo"
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
    }
  }, [previewData]);

  const handleChange = (header, mappedField) => {
    setFieldMapping((prev) => ({
      ...prev,
      [header]: mappedField
    }));
  };

  const handleConfirm = () => {
    onConfirm(fieldMapping);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-[95vw] max-w-[1100px] max-h-[90vh] overflow-auto">
        <h2 className="text-xl font-semibold mb-4 text-[#463970]">CSV Preview</h2>

        <div className="overflow-x-auto border border-gray-200 rounded">
          <table className="min-w-full text-sm text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                {previewData?.headers?.map((header, index) => (
                  <th key={index} className="p-3 border-b font-semibold">
                    <select
                      value={fieldMapping[header] || ""}
                      onChange={(e) => handleChange(header, e.target.value)}
                      className="text-xs w-full px-2 py-1 border rounded"
                    >
                      <option value="">-- Skip --</option>
                      {knownFields.map((field) => (
                        <option key={field} value={field}>{field}</option>
                      ))}
                    </select>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewData?.sample?.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-gray-50 border-t text-gray-800"
                >
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="p-2 max-w-[250px] truncate border-r last:border-r-0">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="flex justify-between items-center mt-5 text-sm text-muted-foreground">
          <div>
            <p>🧮 Rows sampled: <strong>{previewData?.sample?.length || 0}</strong></p>
            <p>📋 Columns mapped: <strong>{Object.values(fieldMapping).filter(Boolean).length}</strong></p>
            <a
              href="/admin/AdminImportHistory"
              className="text-blue-600 hover:underline text-xs inline-block mt-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Import History
            </a>
          </div>

          <div className="flex gap-3">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button onClick={handleConfirm}>Import</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
