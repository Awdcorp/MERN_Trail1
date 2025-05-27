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
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold">{editingId ? "Edit Page" : "Create New Page"}</h2>

            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
                <Input name="title" value={formData.title} onChange={handleInput} placeholder="Title" required />
                <Input name="slug" value={formData.slug} onChange={handleInput} placeholder="Slug (e.g. about-us)" required />
                <Textarea name="content" value={formData.content} onChange={handleInput} placeholder="Content (HTML or text)" rows={5} />

                <select name="status" value={formData.status} onChange={handleInput} className="w-full border rounded p-2">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                </select>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input name="seo.metaTitle" value={formData.seo.metaTitle} onChange={handleInput} placeholder="Meta Title" />
                    <Input name="seo.metaDescription" value={formData.seo.metaDescription} onChange={handleInput} placeholder="Meta Description" />
                    <Input name="seo.focusKeyword" value={formData.seo.focusKeyword} onChange={handleInput} placeholder="Focus Keyword" />
                </div>

                <Button type="submit">{editingId ? "Update Page" : "Create Page"}</Button>
            </form>

            <h3 className="text-xl font-semibold pt-6">All Pages</h3>
            <div className="overflow-auto">
                <table className="min-w-full border mt-2 bg-white rounded shadow text-sm">
                    <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="p-2">Title</th>
                            <th className="p-2">Slug</th>
                            <th className="p-2">Status</th>
                            <th className="p-2">Updated</th>
                            <th className="p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* 🔥 Homepage row */}
                        <tr className="border-t bg-yellow-50 font-medium">
                            <td className="p-2">Homepage</td>
                            <td className="p-2 text-blue-700">
                                <a href="/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-500">/</a>
                            </td>
                            <td className="p-2">Published</td>
                            <td className="p-2">–</td>
                            <td className="p-2 flex gap-2">
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

                        {/* All real CMS pages */}
                        {pages.map((page) => (
                            <tr key={page._id} className="border-t hover:bg-gray-50">
                                <td className="p-2">{page.title}</td>
                                <td className="p-2 text-blue-700">
                                    <a href={`/pages/${page.slug}`} target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-500">
                                        /pages/{page.slug}
                                    </a>
                                </td>
                                <td className="p-2 capitalize">{page.status}</td>
                                <td className="p-2">{new Date(page.updatedAt).toLocaleString()}</td>
                                <td className="p-2 flex gap-2">
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
