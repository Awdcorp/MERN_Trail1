// File: src/pages/admin-view/media.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Trash, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AdminMedia() {
  const [media, setMedia] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMedia = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/media`);
    setMedia(res.data);
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleDelete = async (public_id) => {
    if (!confirm("Are you sure you want to delete this file?")) return;
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/media/${public_id}`);
    fetchMedia();
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", "partyworld/products");

    await axios.post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_API_CLOUD_NAME}/image/upload`, formData);
    setFile(null);
    fetchMedia();
    setLoading(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <Button onClick={handleUpload} disabled={!file || loading}>
          <Upload className="mr-2 h-4 w-4" /> Upload
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {media.map((img) => (
          <div key={img.public_id} className="relative group rounded overflow-hidden border">
            <img src={img.url} alt="media" className="w-full h-32 object-cover" />
            <button
              onClick={() => handleDelete(img.public_id)}
              className="absolute top-1 right-1 bg-white text-red-600 p-1 rounded-full shadow hidden group-hover:block"
            >
              <Trash className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
