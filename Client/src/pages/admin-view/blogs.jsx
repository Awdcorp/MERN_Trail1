import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/admin-view/data-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import CommonForm from "@/components/common/form";

const formElements = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "slug", label: "Slug", type: "text", required: true },
  { name: "summary", label: "Summary", type: "textarea" },
  { name: "content", label: "Content", type: "textarea", rows: 8 },
  { name: "image", label: "Featured Image URL", type: "text" },
  { name: "author", label: "Author", type: "text" },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { id: "draft", label: "Draft" },
      { id: "published", label: "Published" },
    ],
  },
];

export default function AdminBlogs() {
  const { toast } = useToast();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  const fetchBlogs = async () => {
    try {
      console.log("📥 Fetching all blogs...");
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/blogs/all`,
        { withCredentials: true }
      );
      console.log("✅ Blogs fetched:", res.data.data);
      setBlogs(res.data.data);
    } catch (err) {
      console.error("❌ Failed to fetch blogs:", err);
      toast({ title: "Failed to fetch blogs", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      const url = editingBlog?._id
        ? `${import.meta.env.VITE_API_URL}/api/admin/blogs/update/${editingBlog._id}`
        : `${import.meta.env.VITE_API_URL}/api/admin/blogs/create`;
      const method = editingBlog?._id ? "put" : "post";

      console.log("📤 Submitting blog form:", formData);
      const res = await axios[method](url, formData, {
        withCredentials: true,
      });

      toast({ title: editingBlog ? "Blog updated" : "Blog created" });
      setOpenDialog(false);
      setEditingBlog(null);
      fetchBlogs();
    } catch (err) {
      console.error("❌ Failed to save blog:", err);
      toast({ title: "Failed to save blog", variant: "destructive" });
    }
  };

  const handleDelete = async (id) => {
    try {
      console.log("🗑 Deleting blog with ID:", id);
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/blogs/delete/${id}`,
        { withCredentials: true }
      );
      toast({ title: "Blog deleted" });
      fetchBlogs();
    } catch (err) {
      console.error("❌ Failed to delete blog:", err);
      toast({ title: "Failed to delete", variant: "destructive" });
    }
  };

  const columns = [
    { header: "Title", accessorKey: "title" },
    { header: "Slug", accessorKey: "slug" },
    { header: "Author", accessorKey: "author" },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => {
        const status = row?.status || "draft";
        const color =
          status === "published"
            ? "bg-green-100 text-green-800"
            : "bg-yellow-100 text-yellow-800";
        return (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${color}`}>
            {status}
          </span>
        );
      },
    },
    {
      header: "Actions",
      cell: (row) => {
        const blog = row;
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => {
                setEditingBlog(blog);
                setOpenDialog(true);
              }}
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleDelete(blog._id)}
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Manage Blogs</h1>
        <Button
          onClick={() => {
            setEditingBlog(null);
            setOpenDialog(true);
          }}
        >
          + Create New Blog
        </Button>
      </div>

      <DataTable columns={columns} data={blogs} isLoading={loading} />

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="w-screen h-screen max-w-none p-0 flex pr-60">
          <div className="pl-60 flex-1 bg-white p-8 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">{editingBlog ? "Edit Blog" : "Create Blog"}</h2>

            <div className="space-y-2">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded"
                  value={editingBlog?.title || ""}
                  onChange={(e) =>
                    setEditingBlog((prev) => ({ ...prev, title: e.target.value }))
                  }
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea
                  rows={7}
                  className="w-full border px-3 py-2 rounded"
                  value={editingBlog?.content || ""}
                  onChange={(e) =>
                    setEditingBlog((prev) => ({ ...prev, content: e.target.value }))
                  }
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium mb-1">Summary (Excerpt)</label>
                <textarea
                  rows={3}
                  className="w-full border px-3 py-2 rounded"
                  value={editingBlog?.summary || ""}
                  onChange={(e) =>
                    setEditingBlog((prev) => ({ ...prev, summary: e.target.value }))
                  }
                />
              </div>

              {/* SEO */}
              <div>
                <label className="block text-sm font-medium mb-1">Slug</label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded"
                  value={editingBlog?.slug || ""}
                  onChange={(e) =>
                    setEditingBlog((prev) => ({ ...prev, slug: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>

          <div className="w-[320px] border-l p-6 pt-20 space-y-6 overflow-y-auto">
            {/* Visibility */}
            <div>
              <label className="block text-sm font-medium mb-2">Visibility</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="status"
                    value="published"
                    checked={editingBlog?.status === "published"}
                    onChange={(e) =>
                      setEditingBlog((prev) => ({ ...prev, status: e.target.value }))
                    }
                  />
                  <span>Visible</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="status"
                    value="draft"
                    checked={editingBlog?.status === "draft"}
                    onChange={(e) =>
                      setEditingBlog((prev) => ({ ...prev, status: e.target.value }))
                    }
                  />
                  <span>Hidden</span>
                </label>
              </div>
            </div>

            {/* Image */}
            <div>
              <label className="block text-sm font-medium mb-1">Featured Image URL</label>
              <input
                type="text"
                className="w-full border px-3 py-2 rounded"
                value={editingBlog?.image || ""}
                onChange={(e) =>
                  setEditingBlog((prev) => ({ ...prev, image: e.target.value }))
                }
              />
              {editingBlog?.image && (
                <img
                  src={editingBlog.image}
                  alt="Preview"
                  className="mt-3 w-full rounded border"
                />
              )}
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-medium mb-1">Author</label>
              <input
                type="text"
                className="w-full border px-3 py-2 rounded"
                value={editingBlog?.author || ""}
                onChange={(e) =>
                  setEditingBlog((prev) => ({ ...prev, author: e.target.value }))
                }
              />
            </div>

            {/* Actions */}
            <div className="pt-4">
              <Button className="w-full" onClick={() => handleSave(editingBlog)}>
                {editingBlog ? "Update Blog" : "Create Blog"}
              </Button>
            </div>
          </div>
        </DialogContent>

      </Dialog>
    </div>
  );
}
