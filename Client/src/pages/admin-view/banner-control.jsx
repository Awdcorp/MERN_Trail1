import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

export default function BannerControlPage() {
  const [banners, setBanners] = useState([]);
  const [form, setForm] = useState({
    title: "",
    desktopImage: "",
    mobileImage: "",
    link: "",
    isActive: true,
  });
  const [editId, setEditId] = useState(null);

  const fetchBanners = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/banners`);
      setBanners(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Banner fetch error", err);
      setBanners([]);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/banners/${editId}`, form);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/banners`, form);
      }
      setForm({ title: "", desktopImage: "", mobileImage: "", link: "", isActive: true });
      setEditId(null);
      fetchBanners();
    } catch (err) {
      console.error("Banner submit error", err);
    }
  };

  const handleEdit = (b) => {
    setForm(b);
    setEditId(b._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/banners/${id}`);
      fetchBanners();
    } catch (err) {
      console.error("Delete error", err);
    }
  };


  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{editId ? "Edit" : "Add"} Banner</h2>
      <form className="grid gap-2 max-w-xl" onSubmit={handleSubmit}>
        <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input placeholder="Desktop Image URL" value={form.desktopImage} onChange={(e) => setForm({ ...form, desktopImage: e.target.value })} />
        <input placeholder="Mobile Image URL" value={form.mobileImage} onChange={(e) => setForm({ ...form, mobileImage: e.target.value })} />
        <input placeholder="Link (optional)" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} />
        <label>
          <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
          Active
        </label>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">{editId ? "Update" : "Create"}</button>
      </form>

      <hr className="my-6" />

      <h3 className="text-xl font-semibold mb-2">Existing Banners</h3>
      <div className="grid gap-4">
      {Array.isArray(banners) && banners.map((b) => (
          <div key={b._id} className="border p-3 rounded bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold">{b.title}</p>
                <p className="text-sm text-gray-500">{b.link}</p>
                <img src={b.desktopImage} alt="desktop" className="h-20 mt-2" />
                <img src={b.mobileImage} alt="mobile" className="h-20 mt-2" />
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => handleEdit(b)} className="bg-yellow-400 p-1 rounded">Edit</button>
                <button onClick={() => handleDelete(b._id)} className="bg-red-500 text-white p-1 rounded">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
