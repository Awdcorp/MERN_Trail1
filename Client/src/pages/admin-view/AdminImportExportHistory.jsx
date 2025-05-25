// File: src/pages/admin-view/AdminImportHistory.jsx (updated)

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

export default function AdminImportHistory() {
  const [logs, setLogs] = useState([]);
  const [exportLogs, setExportLogs] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const fetchExportLogs = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/products/export-logs`);
      setExportLogs(res.data.data);
    } catch (err) {
      console.error("Failed to fetch export logs", err);
    }
  };

  const handleRevert = async (logId) => {
    if (!confirm("Are you sure you want to revert this import?")) return;
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/products/import-revert`, { logId });
      fetchLogs();
    } catch (err) {
      console.error("Failed to revert import", err);
    }
  };

  return (
    <div className="p-6 space-y-12">
      <div>
        <h1 className="text-2xl font-semibold mb-4">Import History</h1>
        {loading ? (
          <p>Loading logs...</p>
        ) : logs.length === 0 ? (
          <p>No import logs found.</p>
        ) : (
          <table className="min-w-full text-sm border">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-2">File Name</th>
                <th className="px-4 py-2">Imported</th>
                <th className="px-4 py-2">Skipped</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2 text-right">Actions</th>
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

      <div>
        <h1 className="text-2xl font-semibold mb-4">Export History</h1>
        {exportLogs.length === 0 ? (
          <p>No export logs found.</p>
        ) : (
          <table className="min-w-full text-sm border">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-2">File Name</th>
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
    </div>
  );
}