// File: src/pages/admin-view/media.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Trash, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function AdminMedia() {
  const [media, setMedia] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("partyworld/products");
  const [preview, setPreview] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  const fetchMedia = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/media`, {
      params: { folder: selectedFolder },
      headers: { "Cache-Control": "no-cache" },
    });
    setMedia(res.data);
  };

  useEffect(() => {
    fetchMedia();
  }, [selectedFolder]);

  const handleDelete = async (public_id) => {
    if (!confirm("Are you sure you want to delete this file?")) return;
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/media/${public_id}`);
    fetchMedia();
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedItems.length} selected files?`)) return;
    for (const id of selectedItems) {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/media/${id}`);
    }
    setSelectedItems([]);
    fetchMedia();
  };

  const handleUpload = async (files) => {
    if (!files || !files.length) return;
    setLoading(true);
    setUploadProgress([]);

    const uploads = Array.from(files).map((f, index) => {
      const formData = new FormData();
      formData.set("file", f);
      formData.set("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
      formData.set("folder", selectedFolder);

      return axios.post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_API_CLOUD_NAME}/image/upload`, formData, {
        onUploadProgress: (e) => {
          setUploadProgress((prev) => {
            const next = [...prev];
            next[index] = Math.round((e.loaded * 100) / e.total);
            return next;
          });
        },
      });
    });

    await Promise.all(uploads);
    setFile(null);
    setLoading(false);
    setUploadProgress([]);
    setTimeout(fetchMedia, 1000); // ✅ allow Cloudinary time to index
  };

  const toggleSelection = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedItems.length === media.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(media.map((img) => img.public_id));
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-4 flex-wrap">
        <select
          className="border px-3 py-2 rounded"
          value={selectedFolder}
          onChange={(e) => setSelectedFolder(e.target.value)}
        >
          <option value="partyworld/products">Products</option>
          <option value="partyworld/banners">Banners</option>
          <option value="partyworld/uploads">Uploads</option>
        </select>

        <Input
          type="file"
          multiple
          onChange={(e) => setFile(e.target.files)}
          className="max-w-sm"
        />

        <Button onClick={() => handleUpload(file)} disabled={!file || loading}>
          <Upload className="mr-2 h-4 w-4" /> Upload
        </Button>

        {media.length > 0 && (
          <Button variant="outline" onClick={selectAll}>
            {selectedItems.length === media.length ? "Deselect All" : "Select All"}
          </Button>
        )}

        {selectedItems.length > 0 && (
          <Button variant="destructive" onClick={handleBulkDelete}>
            <Trash className="mr-2 h-4 w-4" /> Delete Selected ({selectedItems.length})
          </Button>
        )}
      </div>

      {/* Dropzone */}
      <div
        onDrop={(e) => {
          e.preventDefault();
          handleUpload(e.dataTransfer.files);
        }}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-400 rounded p-6 text-center text-sm text-gray-500 cursor-pointer hover:bg-gray-50"
      >
        Drag & drop images here or use the file picker above
      </div>

      {uploadProgress.length > 0 && (
        <div className="space-y-2">
          {uploadProgress.map((p, i) => (
            <div key={i} className="w-full bg-gray-100 rounded h-2">
              <div
                className="bg-blue-500 h-2 rounded"
                style={{ width: `${p}%` }}
              ></div>
            </div>
          ))}
        </div>
      )}

      {/* Image Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {media.map((img) => (
          <div key={img.public_id} className="relative group rounded overflow-hidden border">
            <input
              type="checkbox"
              className="absolute top-1 left-1 z-10"
              checked={selectedItems.includes(img.public_id)}
              onChange={() => toggleSelection(img.public_id)}
            />
            <img
              src={img.url}
              alt="media"
              className="w-full h-32 object-cover cursor-pointer"
              onClick={() => setPreview(img)}
            />
            <button
              onClick={() => handleDelete(img.public_id)}
              className="absolute top-1 right-1 bg-white text-red-600 p-1 rounded-full shadow hidden group-hover:block"
            >
              <Trash className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Preview Dialog */}
      <Dialog open={!!preview} onOpenChange={() => setPreview(null)}>
        <DialogContent className="max-w-4xl">
          {preview && (
            <div className="flex flex-col md:flex-row gap-6">
              <img
                src={preview.url}
                alt="preview"
                className="w-full md:max-w-[350px] rounded border"
              />
              <div className="text-sm text-muted-foreground space-y-3">
                <DialogHeader>
                  <DialogTitle className="text-base font-semibold break-all">
                    {preview.public_id}
                  </DialogTitle>
                </DialogHeader>
                <p><strong>Format:</strong> {preview.format}</p>
                <p><strong>Created:</strong> {new Date(preview.created_at).toLocaleString()}</p>
                <p><strong>URL:</strong> <a href={preview.url} target="_blank" className="text-blue-600 underline">Open in new tab</a></p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
