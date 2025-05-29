// [unchanged imports]
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Pencil, Trash2, Eye, LayoutDashboard } from "lucide-react";

export default function AdminPagesManager() {
    const { toast } = useToast();
    const [pages, setPages] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        content: "",
        status: "draft",
        seo: {
            metaTitle: "",
            metaDescription: "",
            focusKeyword: ""
        }
    });
    const [editingId, setEditingId] = useState(null);

    const fetchPages = async () => {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/pages`);
        setPages(res.data);
    };

    useEffect(() => {
        fetchPages();
    }, []);

    const handleInput = (e) => {
        const { name, value } = e.target;
        if (name.startsWith("seo.")) {
            const seoKey = name.split(".")[1];
            setFormData(prev => ({
                ...prev,
                seo: { ...prev.seo, [seoKey]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/pages/${editingId}`, formData);
                toast({ title: "Page updated successfully" });
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/pages`, formData);
                toast({ title: "Page created successfully" });
            }
            setFormData({
                title: "",
                slug: "",
                content: "",
                status: "draft",
                seo: { metaTitle: "", metaDescription: "", focusKeyword: "" }
            });
            setEditingId(null);
            fetchPages();
        } catch (err) {
            toast({ title: "Error", description: err.message });
        }
    };

    const handleEdit = (page) => {
        setFormData(page);
        setEditingId(page._id);
    };

    const handleDelete = async (id) => {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/pages/${id}`);
        toast({ title: "Page deleted" });
        fetchPages();
    };

    return (
  <div className="p-6 max-w-5xl mx-auto space-y-8">
    <h2 className="text-2xl font-bold">{editingId ? "Edit Page" : "Create New Page"}</h2>

    {/* 🔧 Page Form */}
    <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-xl shadow border">
      <div className="grid gap-4">
        <Input
          name="title"
          value={formData.title}
          onChange={handleInput}
          placeholder="Title"
          required
        />
        <Input
          name="slug"
          value={formData.slug}
          onChange={handleInput}
          placeholder="Slug (e.g. about-us)"
          required
        />
        <Textarea
          name="content"
          value={formData.content}
          onChange={handleInput}
          placeholder="Content (HTML or text)"
          rows={6}
        />
        <select
          name="status"
          value={formData.status}
          onChange={handleInput}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      {/* 📝 SEO Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <Input
          name="seo.metaTitle"
          value={formData.seo.metaTitle}
          onChange={handleInput}
          placeholder="Meta Title"
        />
        <Input
          name="seo.metaDescription"
          value={formData.seo.metaDescription}
          onChange={handleInput}
          placeholder="Meta Description"
        />
        <Input
          name="seo.focusKeyword"
          value={formData.seo.focusKeyword}
          onChange={handleInput}
          placeholder="Focus Keyword"
        />
      </div>

      <div className="pt-4">
        <Button type="submit">{editingId ? "Update Page" : "Create Page"}</Button>
      </div>
    </form>

    {/* 📋 Pages Table */}
    <h3 className="text-xl font-semibold pt-6">All Pages</h3>
    <div className="overflow-auto border rounded-xl bg-white shadow">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100 text-left font-semibold text-gray-700">
          <tr>
            <th className="p-3">Title</th>
            <th className="p-3">Slug</th>
            <th className="p-3">Status</th>
            <th className="p-3">Updated</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* 🏠 Homepage row */}
          <tr className="border-t bg-yellow-50 font-medium text-sm">
            <td className="p-3">Homepage</td>
            <td className="p-3 text-blue-600 underline">
              <a href="/" target="_blank" rel="noopener noreferrer">/</a>
            </td>
            <td className="p-3">Published</td>
            <td className="p-3">–</td>
            <td className="p-3 flex flex-wrap gap-2">
              <Button variant="ghost" asChild>
                <a href="/" target="_blank" rel="noopener noreferrer" title="View">
                  <Eye size={16} />
                </a>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/admin/page-builder?type=homepage" title="Open Builder">
                  <LayoutDashboard size={16} />
                </Link>
              </Button>
            </td>
          </tr>

          {/* 🌐 Other pages */}
          {pages.map((page) => (
            <tr key={page._id} className="border-t hover:bg-gray-50 text-sm">
              <td className="p-3">{page.title}</td>
              <td className="p-3 text-blue-600 underline">
                <a
                  href={`/pages/${page.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  /pages/{page.slug}
                </a>
              </td>
              <td className="p-3 capitalize">{page.status}</td>
              <td className="p-3">{new Date(page.updatedAt).toLocaleString()}</td>
              <td className="p-3 flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => handleEdit(page)}><Pencil size={16} /></Button>
                <Button variant="destructive" onClick={() => handleDelete(page._id)}><Trash2 size={16} /></Button>
                <Button variant="ghost" asChild>
                  <a href={`/pages/${page.slug}`} target="_blank" rel="noopener noreferrer" title="View">
                    <Eye size={16} />
                  </a>
                </Button>
                <Button variant="ghost" asChild>
                  <Link to={`/admin/page-builder?type=page&id=${page._id}`} title="Open Builder">
                    <LayoutDashboard size={16} />
                  </Link>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

}
