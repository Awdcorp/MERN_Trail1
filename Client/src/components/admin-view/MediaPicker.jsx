import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import axios from "axios";

export default function MediaPicker({ open, onClose, onSelect }) {
  const [media, setMedia] = useState([]);

  useEffect(() => {
  if (!open) return;

  axios
    .get(`${import.meta.env.VITE_API_URL}/api/admin/media?folder=banners&max_results=60`)
    .then((res) => {
      console.log("🧩 Media Picker Data:", res.data); // See what's inside
      setMedia(res.data.files || res.data.resources || []); // <--- handles both formats
    })
    .catch((err) => {
      console.error("MediaPicker failed to load:", err);
      setMedia([]);
    });
}, [open]);


  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Select an Image</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-2">
          {media.map((img) => (
            <div
              key={img.public_id}
              className="border rounded cursor-pointer overflow-hidden hover:shadow-md"
              onClick={() => {
                onSelect(img.url);
                onClose(false);
              }}
            >
              <img
                src={img.url}
                alt={img.public_id}
                className="w-full h-32 object-cover"
              />
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
