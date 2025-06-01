import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Trash2, Pencil } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const initialForm = {
  code: "",
  type: "fixed", // or "percentage"
  value: "",
  minOrderAmount: "",
  maxDiscount: "",
  expiresAt: "",
  usageLimit: "",
  isActive: true,
};

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const { toast } = useToast();

  const fetchCoupons = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/coupons`);
      setCoupons(res.data.data);
      console.log("📦 Coupons fetched:", res.data.data.length);
    } catch (err) {
      console.error("❌ Failed to fetch coupons", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form };
    if (editingId) payload.id = editingId;

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/coupons`, payload);
      console.log(`[✅ Coupon ${editingId ? "updated" : "created"}]:`, res.data.data.code);
      toast({ title: `Coupon ${editingId ? "updated" : "created"} successfully` });
      setForm(initialForm);
      setEditingId(null);
      fetchCoupons();
    } catch (err) {
      console.error("❌ Failed to save coupon", err);
      toast({ title: "Failed to save coupon", variant: "destructive" });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/coupons/${id}`);
      console.log("🗑️ Coupon deleted:", id);
      toast({ title: "Coupon deleted" });
      fetchCoupons();
    } catch (err) {
      console.error("❌ Failed to delete coupon", err);
    }
  };

  const startEdit = (coupon) => {
    setEditingId(coupon._id);
    setForm({
      ...coupon,
      expiresAt: coupon.expiresAt?.slice(0, 10) || "",
    });
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Discount Coupons</h1>

      {/* Coupon Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-10">
        <Input placeholder="Coupon Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required />
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="border rounded px-3 py-2">
          <option value="fixed">Fixed Amount (₹)</option>
          <option value="percentage">Percentage (%)</option>
        </select>
        <Input type="number" placeholder="Value" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} required />
        <Input type="number" placeholder="Min Order Amount" value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })} />
        <Input type="number" placeholder="Max Discount (for %)" value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })} />
        <Input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
        <Input type="number" placeholder="Usage Limit" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} />
        <select value={form.isActive ? "true" : "false"} onChange={(e) => setForm({ ...form, isActive: e.target.value === "true" })} className="border rounded px-3 py-2">
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        <div className="col-span-2">
          <Button type="submit">{editingId ? "Update Coupon" : "Create Coupon"}</Button>
          {editingId && (
            <Button type="button" variant="ghost" className="ml-2" onClick={() => { setForm(initialForm); setEditingId(null); }}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      {/* Coupon List */}
      <div className="grid gap-4">
        {coupons.map((coupon) => (
          <Card key={coupon._id} className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-md font-semibold">{coupon.code} — <span className="text-sm text-muted-foreground">{coupon.type === "fixed" ? `₹${coupon.value}` : `${coupon.value}%`}</span></h3>
              <p className="text-xs text-muted-foreground">Min: ₹{coupon.minOrderAmount || 0} | Max: ₹{coupon.maxDiscount || "—"} | Usage: {coupon.usedCount}/{coupon.usageLimit || "∞"}</p>
              <p className="text-xs text-muted-foreground">Expires: {coupon.expiresAt?.slice(0, 10) || "—"} | Status: {coupon.isActive ? "Active" : "Inactive"}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => startEdit(coupon)}><Pencil className="w-4 h-4" /></Button>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(coupon._id)}><Trash2 className="w-4 h-4" /></Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
