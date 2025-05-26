// File: Client/src/pages/admin-view/AdminMenus.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

export default function AdminMenus() {
  const { toast } = useToast();
  const [headerItems, setHeaderItems] = useState([]);
  const [footerItems, setFooterItems] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/admin/menus/header`).then((res) => {
      console.log("📦 Admin header menu loaded:", res.data);
      setHeaderItems(res.data.items || []);
    }).catch((err) => {
      console.error("❌ Failed to fetch header menu", err);
    });

    axios.get(`${import.meta.env.VITE_API_URL}/api/admin/menus/footer`).then((res) => {
      console.log("📦 Admin footer menu loaded:", res.data);
      setFooterItems(res.data.items || []);
    }).catch((err) => {
      console.error("❌ Failed to fetch footer menu", err);
    });
  }, []);

  const handleChange = (setter, index, key, value) => {
    setter((prev) => {
      const copy = [...prev];
      copy[index][key] = value;
      return copy;
    });
  };

  const addNewItem = (setter) => setter((prev) => [...prev, { label: "", link: "", type: "internal" }]);

  const saveMenu = async (name, items) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/menus/${name}`, { items });
      toast({ title: `${name} menu saved` });
    } catch (err) {
      toast({ title: `Error saving ${name} menu`, variant: "destructive" });
    }
  };

  const renderEditor = (name, items, setItems) => (
    <Card className="p-4 space-y-4">
      <h2 className="text-xl font-bold capitalize">{name} Menu</h2>
      {items.map((item, idx) => (
        <div key={idx} className="flex gap-2">
          <Input placeholder="Label" value={item.label} onChange={(e) => handleChange(setItems, idx, "label", e.target.value)} />
          <Input placeholder="Link" value={item.link} onChange={(e) => handleChange(setItems, idx, "link", e.target.value)} />
          <select value={item.type} onChange={(e) => handleChange(setItems, idx, "type", e.target.value)}>
            <option value="internal">Internal</option>
            <option value="external">External</option>
          </select>
        </div>
      ))}
      <Button variant="outline" onClick={() => addNewItem(setItems)}>+ Add Item</Button>
      <Button onClick={() => saveMenu(name, items)}>Save {name}</Button>
    </Card>
  );

  return (
    <div className="p-6 space-y-8">
      {renderEditor("header", headerItems, setHeaderItems)}
      {renderEditor("footer", footerItems, setFooterItems)}
    </div>
  );
}