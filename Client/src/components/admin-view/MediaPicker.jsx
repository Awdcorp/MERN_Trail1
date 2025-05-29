import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function MediaPicker({ open, onClose, onSelect }) {
  const [media, setMedia] = useState([]);

  useEffect(() => {
    if (!open) return;

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/admin/media?folder=uploads/occasions&max_results=60`)
      .then((res) => {
        setMedia(res.data.files || res.data.resources || []);
      })
      .catch((err) => {
        console.error("MediaPicker failed to load:", err);
        setMedia([]);
      });
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">📁 Select Media</DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 p-4">
            {media.map((img) => (
              <div
                key={img.public_id}
                className="relative group border rounded-md overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer"
                onClick={() => {
                  onSelect(img.url);
                  onClose(false);
                }}
              >
                {/* Image Thumbnail */}
                <img
                  src={img.url}
                  alt={img.public_id}
                  className="w-full h-40 object-cover"
                />

                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                  <Button size="sm" variant="secondary">Select</Button>
                  <a
                    href={img.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button size="sm" variant="outline">Preview</Button>
                  </a>
                </div>

                {/* File Info */}
                <div className="text-[11px] text-gray-700 bg-white border-t px-2 py-1 truncate">
                  <div title={img.public_id} className="truncate">
                    {img.public_id.split("/").pop()}
                  </div>
                  {img.bytes && (
                    <div className="text-gray-400 text-[10px]">
                      {(img.bytes / 1024).toFixed(1)} KB
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
