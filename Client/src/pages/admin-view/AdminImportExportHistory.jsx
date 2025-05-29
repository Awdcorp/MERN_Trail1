import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import CSVPreviewModal from "@/components/admin-view/CSVPreviewModal";

const allExportableFields = [
  "title", "slug", "description", "shortDescription", "categories", "brand", "price",
  "salePrice", "totalStock", "weight", "sku", "tags", "images", "variants", "attributes",
  "relatedProductIds", "upsellProductIds", "isActive", "isFeatured", "externalId",
  "averageReview", "meta", "seo"
];

export default function AdminImportExportDashboard() {
  const [logs, setLogs] = useState([]);
  const [exportLogs, setExportLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [selectedFields, setSelectedFields] = useState(allExportableFields);
  const [previewData, setPreviewData] = useState(null);
  const [pendingCSVFile, setPendingCSVFile] = useState(null);
  const [exportCount, setExportCount] = useState(0);

  useEffect(() => {
    fetchLogs();
    fetchExportLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/products/import-logs`);
      setLogs(res.data.data);
    } catch (err) {
      console.error("Failed to fetch import logs", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (showExportDialog) {
      fetch(`${import.meta.env.VITE_API_URL}/api/admin/products/export/count`)
        .then((res) => res.json())
        .then((data) => setExportCount(data?.count || 0))
        .catch(() => setExportCount(0));
    }
  }, [showExportDialog]);
  
  const fetchExportLogs = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/products/export-logs`);
      setExportLogs(res.data.data);
    } catch (err) {
      console.error("Failed to fetch export logs", err);
    }
  };

  const handleCSVPreview = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPendingCSVFile(file);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/products/preview-csv`, {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (result.success) {
        setPreviewData(result);
      }
    } catch (err) {
      console.error("CSV preview failed", err);
    }
  };

  const handlePreviewConfirm = async (mapping) => {
    if (!pendingCSVFile) return;
    const formData = new FormData();
    formData.append("file", pendingCSVFile);
    formData.append("mapping", JSON.stringify(mapping));

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/admin/products/import`, {
        method: "POST",
        body: formData,
      });
      fetchLogs();
    } catch (err) {
      console.error("CSV import failed", err);
    } finally {
      setPreviewData(null);
      setPendingCSVFile(null);
    }
  };

  const handleExport = async () => {
    const query = selectedFields.map((f) => `fields=${f}`).join("&");
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/products/export?${query}`);
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "products_export.csv";
    link.click();
    window.URL.revokeObjectURL(url);
    setShowExportDialog(false);
    fetchExportLogs();
  };

  const handleRevert = async (logId) => {
    if (!confirm("Revert this import?")) return;
    await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/products/import-revert`, { logId });
    fetchLogs();
  };

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-2xl font-bold text-[#463970]">📥 Import / Export Dashboard</h1>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <div className="relative overflow-hidden">
          <Button variant="default">Import CSV</Button>
          <input
            type="file"
            accept=".csv"
            onChange={handleCSVPreview}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>
        <Button variant="outline" onClick={() => setShowExportDialog(true)}>Export Settings</Button>
      </div>

      {/* Import History */}
      <div>
        <h2 className="text-xl font-semibold mb-2">🧾 Import History</h2>
        {loading ? (
          <p>Loading...</p>
        ) : logs.length === 0 ? (
          <p>No import logs found.</p>
        ) : (
          <table className="min-w-full text-sm border">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-2">File</th>
                <th className="px-4 py-2">Imported</th>
                <th className="px-4 py-2">Skipped</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id} className="border-t">
                  <td className="px-4 py-2">{log.fileName}</td>
                  <td className="px-4 py-2">{log.importedCount}</td>
                  <td className="px-4 py-2">{log.skippedCount}</td>
                  <td className="px-4 py-2">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="px-4 py-2 text-right">
                    <Button
                      variant="destructive"
                      onClick={() => handleRevert(log._id)}
                      disabled={log.reverted}
                    >
                      {log.reverted ? "Reverted" : "Revert"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Export History */}
      <div>
        <h2 className="text-xl font-semibold mb-2">📤 Export History</h2>
        {exportLogs.length === 0 ? (
          <p>No export logs found.</p>
        ) : (
          <table className="min-w-full text-sm border">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-2">File</th>
                <th className="px-4 py-2">Fields</th>
                <th className="px-4 py-2">Count</th>
                <th className="px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {exportLogs.map((log) => (
                <tr key={log._id} className="border-t">
                  <td className="px-4 py-2">{log.fileName}</td>
                  <td className="px-4 py-2 whitespace-pre-wrap">{log.fields?.join(", ")}</td>
                  <td className="px-4 py-2">{log.count}</td>
                  <td className="px-4 py-2">{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Export Settings Dialog */}
      {showExportDialog && (
  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
    <div className="bg-white rounded-lg shadow-lg w-full max-w-[600px] max-h-[90vh] overflow-y-auto p-6">
      <h2 className="text-xl font-semibold mb-4 text-[#463970]">Select Fields to Export</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6 mb-6">
        {allExportableFields.map((field) => (
          <label key={field} className="flex items-center gap-2 text-sm capitalize text-gray-800">
            <input
              type="checkbox"
              checked={selectedFields.includes(field)}
              onChange={(e) => {
                if (e.target.checked) setSelectedFields([...selectedFields, field]);
                else setSelectedFields(selectedFields.filter((f) => f !== field));
              }}
            />
            {field === "sku"
              ? "SKU"
              : field === "seo"
              ? "SEO Meta"
              : field === "externalId"
              ? "External ID"
              : field.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
          </label>
        ))}
      </div>

      <hr className="my-4 border-gray-300" />

      <div className="text-sm text-muted-foreground mb-4 space-y-1">
        <p>📌 <strong>Selected products:</strong> All</p>
        <p>📦 <strong>Total to export:</strong> {exportCount}</p>
        <p>📑 <strong>Fields selected:</strong> {selectedFields.length}</p>
      </div>

      <div className="flex justify-between items-center mt-5">
        <a
          href="/admin/AdminImportHistory"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline"
        >
          📄 View Import History
        </a>

        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => setShowExportDialog(false)}>Cancel</Button>
          <Button onClick={handleExport}>Export</Button>
        </div>
      </div>
    </div>
  </div>
)}


      {/* CSV Preview */}
      {previewData && (
        <CSVPreviewModal
          previewData={previewData}
          onClose={() => setPreviewData(null)}
          onConfirm={handlePreviewConfirm}
        />
      )}
    </div>
  );
}
