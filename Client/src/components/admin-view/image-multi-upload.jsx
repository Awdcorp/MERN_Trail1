// File: src/components/admin-view/image-multi-upload.jsx

import { UploadCloud, X, GripVertical } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import axios from "axios";

export default function ImageMultiUpload({ images = [], onChange }) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();
  const dragItem = useRef();
  const dragOverItem = useRef();

  const handleUpload = async (file) => {
    setUploading(true);
    const data = new FormData();
    data.append("my_file", file);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/products/upload-image`,
        data
      );
      if (res?.data?.success) {
        onChange([...images, res.data.result.url]);
      }
    } catch (e) {
      console.error("Image upload failed", e);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const removeImage = (url) => {
    onChange(images.filter((img) => img !== url));
  };

  const handleSort = () => {
    const items = [...images];
    const draggedItem = items.splice(dragItem.current, 1)[0];
    items.splice(dragOverItem.current, 0, draggedItem);
    onChange(items);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Images</p>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept="image/*"
        />
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <UploadCloud className="w-4 h-4 mr-2" /> Upload
        </Button>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {images.map((url, index) => (
          <div
            key={url}
            draggable
            onDragStart={() => (dragItem.current = index)}
            onDragEnter={() => (dragOverItem.current = index)}
            onDragEnd={handleSort}
            onDragOver={(e) => e.preventDefault()}
            className="relative group border rounded overflow-hidden cursor-move"
          >
            <img src={url} alt="product" className="object-cover w-full h-24" />
            <button
              type="button"
              className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-100"
              onClick={() => removeImage(url)}
            >
              <X className="w-4 h-4 text-red-500" />
            </button>
            <span className="absolute bottom-1 left-1 bg-white px-1 py-0.5 rounded text-xs shadow flex items-center gap-1">
              <GripVertical className="w-3 h-3 text-muted-foreground" />
              {index + 1}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
