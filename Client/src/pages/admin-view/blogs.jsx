import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/admin-view/data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import axios from "axios";
import CommonForm from "@/components/common/form";
import { Input } from "@/components/ui/input";

const formElements = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "slug", label: "Slug", type: "text", required: true },
  { name: "summary", label: "Summary", type: "textarea" },
  { name: "content", label: "Content", type: "textarea", rows: 8 },
  { name: "image", label: "Featured Image URL", type: "text" },
  { name: "author", label: "Author", type: "text" },
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
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/blogs/all`, {
        withCredentials: true,
      });
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
      console.log(`📡 Calling ${method.toUpperCase()} → ${url}`);

      const res = await axios[method](url, formData, { withCredentials: true });

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
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/blogs/delete/${id}`, {
        withCredentials: true,
      });
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
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => { setEditingBlog(row.original); setOpenDialog(true); }}>
            Edit
          </Button>
          <Button size="sm" variant="destructive" onClick={() => handleDelete(row.original._id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Manage Blogs</h1>
        <Button onClick={() => { setEditingBlog(null); setOpenDialog(true); }}>
          + Create New Blog
        </Button>
      </div>

      <DataTable columns={columns} data={blogs} isLoading={loading} />

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingBlog ? "Edit Blog" : "Create Blog"}</DialogTitle>
          </DialogHeader>
          <CommonForm
            formControls={formElements}
            formData={editingBlog || {}}
            setFormData={setEditingBlog}
            onSubmit={() => handleSave(editingBlog)}
            buttonText={editingBlog ? "Update Blog" : "Create Blog"}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
