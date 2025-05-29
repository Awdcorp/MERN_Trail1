import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import CSVPreviewModal from "@/components/admin-view/CSVPreviewModal";
import { UploadCloud, FileDown, Settings2, FileText, History } from "lucide-react";

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
      {/* Header */}
      <div className="flex items-center gap-2">
        <FileText className="text-[#393E46] w-6 h-6" />
        <h1 className="text-2xl font-bold text-[#393E46]">Import / Export</h1>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative overflow-hidden">
          <Button variant="default" className="flex items-center gap-2">
            <UploadCloud className="w-4 h-4" /> Import CSV
          </Button>
          <input
            type="file"
            accept=".csv"
            onChange={handleCSVPreview}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>

        <Button variant="outline" onClick={() => setShowExportDialog(true)} className="flex items-center gap-2">
          <Settings2 className="w-4 h-4" /> Export Settings
        </Button>

        <a
          href="/sample-product-import.csv"
          download
          className="flex items-center gap-2 text-sm text-blue-600 hover:underline ml-1"
        >
          <FileDown className="w-4 h-4" /> Download Sample CSV
        </a>
      </div>

      {/* Import History */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <History className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold text-muted-foreground">Import History</h2>
        </div>
        <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-white text-left text-xs font-medium border-b text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-2">File</th>
                <th className="px-4 py-2">Imported</th>
                <th className="px-4 py-2">Skipped</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log._id}>
                  <td className="px-4 py-2 font-medium text-gray-800">{log.fileName}</td>
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
        </div>
      </div>

      {/* Export History */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <History className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold text-muted-foreground">Export History</h2>
        </div>
        <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-white text-left text-xs font-medium border-b text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-2">File</th>
                <th className="px-4 py-2">Fields</th>
                <th className="px-4 py-2">Count</th>
                <th className="px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {exportLogs.map((log) => (
                <tr key={log._id}>
                  <td className="px-4 py-2 font-medium text-gray-800">{log.fileName}</td>
                  <td className="px-4 py-2 whitespace-pre-wrap">{log.fields?.join(", ")}</td>
                  <td className="px-4 py-2">{log.count}</td>
                  <td className="px-4 py-2">{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Dialog */}
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
