// File: src/pages/admin-view/media.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Trash, Upload, LayoutGrid, List } from "lucide-react";
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
  const [viewMode, setViewMode] = useState("grid");
  const [limit, setLimit] = useState(20);
  const [nextCursor, setNextCursor] = useState(null);
  const [cursorStack, setCursorStack] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchMedia = async (cursor = null, isNext = true) => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/media`, {
      params: { folder: selectedFolder, max_results: limit, next_cursor: cursor },
      headers: { "Cache-Control": "no-cache" },
    });
    setMedia(res.data.files);
    setNextCursor(res.data.next_cursor || null);

    if (isNext && cursor) {
      setCursorStack((prev) => [...prev, cursor]);
      setCurrentPage((prev) => prev + 1);
    } else if (!isNext && cursorStack.length > 0) {
      setCursorStack((prev) => prev.slice(0, -1));
      setCurrentPage((prev) => prev - 1);
    } else {
      setCursorStack([]);
      setCurrentPage(1);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchMedia(null, false);
    }, 200);
    return () => clearTimeout(timeout);
  }, [limit, selectedFolder]);

  const handleDelete = async (public_id) => {
    if (!confirm("Are you sure you want to delete this file?")) return;
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/media/${public_id}`);
    setCursorStack([]);
    setCurrentPage(1);
    fetchMedia(null, false);
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedItems.length} selected files?`)) return;
    for (const id of selectedItems) {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/media/${id}`);
    }
    setSelectedItems([]);
    setCursorStack([]);
    setCurrentPage(1);
    fetchMedia(null, false);
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
    setTimeout(() => fetchMedia(cursorStack.at(-1) || null, false), 1000);
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
    <div className="flex flex-col h-full pl-4 pr-4 pt-6 space-y-6">
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

        <Button variant="ghost" className="ml-auto" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
          {viewMode === "grid" ? <List className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
        </Button>
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
              <div className="bg-blue-500 h-2 rounded" style={{ width: `${p}%` }}></div>
            </div>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-auto">

{viewMode === "grid" ? (
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
  {media.map((img) => (
    <div
      key={img.public_id}
      className="relative border rounded overflow-hidden group bg-white shadow-sm hover:shadow-md transition"
    >
      {/* Checkbox */}
      <input
        type="checkbox"
        className="absolute top-1 left-1 z-10"
        checked={selectedItems.includes(img.public_id)}
        onChange={() => toggleSelection(img.public_id)}
      />

      {/* Image */}
      <img
        src={img.url}
        alt="media"
        className="w-full h-40 object-contain bg-white"
        onClick={() => setPreview(img)}
      />

      {/* Overlay Delete Button */}
      <button
        onClick={() => handleDelete(img.public_id)}
        className="absolute top-1 right-1 bg-white text-red-600 p-1 rounded-full shadow hidden group-hover:block"
      >
        <Trash className="w-4 h-4" />
      </button>

      {/* Details */}
      <div className="p-2 text-xs text-gray-700 space-y-1 break-all">
        <div className="font-medium truncate">
          {img.public_id.split("/").pop()}
        </div>
<div className="text-gray-500 flex flex-wrap gap-x-2">
  <span>{img.format.toUpperCase()}</span>
  <span>{img.width}×{img.height} px</span>
  <span>{(img.bytes / 1024).toFixed(1)} KB</span>
</div>

      </div>
    </div>
  ))}
</div>

) : (
  <div className="">
    {/* Header */}
    <div className="hidden sm:grid bg-white grid-cols-[60px,100px,1fr,200px,120px,40px] text-xs font-semibold text-muted-foreground px-3 py-3 border-b">
      <input
        type="checkbox"
        checked={selectedItems.length === media.length}
        onChange={selectAll}
        className="w-3 h-3"
      />
      <span>Preview</span>
      <span>Filename</span>
      <span>Dimensions</span>
      <span>Size</span>
      <span></span>
    </div>

    {/* Rows */}
    {media.map((img) => (
      <div key={img.public_id} className="grid grid-cols-[60px,100px,1fr,200px,120px,40px] items-center border-b bg-white rounded px-3 py-1 text-sm">
        <input
          type="checkbox"
          className="w-3 h-3"
          checked={selectedItems.includes(img.public_id)}
          onChange={() => toggleSelection(img.public_id)}
        />

        <img
          src={img.url}
          alt="media"
          className="w-20 h-20 object-cover rounded cursor-pointer"
          onClick={() => setPreview(img)}
        />

        <div className="break-all pr-2">{img.public_id}</div>
        <div>{img.format.toUpperCase()} | {img.width}×{img.height} px</div>
        <div>{(img.bytes / 1024).toFixed(1)} KB</div>

        <button
          onClick={() => handleDelete(img.public_id)}
          className="text-red-600 hover:text-red-800"
        >
          <Trash className="w-4 h-4" />
        </button>
      </div>
    ))}
  </div>
)}


      </div>

      {/* Sticky Pagination Bar */}
      {media.length > 0 && (
        <div className="sticky bottom-0 z-10 bg-white border-t p-4 flex justify-between items-center">
          <div className="text-sm text-muted-foreground flex gap-2 items-center">
            <span>Rows per page:</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(parseInt(e.target.value));
                setCursorStack([]);
                setCurrentPage(1);
              }}
              className="border text-sm px-2 py-1 rounded"
            >
              {[10, 20, 50].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              disabled={cursorStack.length === 0}
              onClick={() => fetchMedia(cursorStack.at(-2) || null, false)}
            >
              Previous
            </Button>
            <span className="text-sm">Page {currentPage}</span>
            <Button
              size="sm"
              disabled={!nextCursor}
              onClick={() => fetchMedia(nextCursor, true)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

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