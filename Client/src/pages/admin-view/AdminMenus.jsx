// File: Client/src/pages/admin-view/AdminMenus.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import SortableItem from "@/components/admin-view/sortable-item";

export default function AdminMenus() {
  const { toast } = useToast();
  const [headerItems, setHeaderItems] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/admin/menus/header`).then((res) => {
      const items = (res.data.items || []).map(item => ({
        ...item,
        id: item.id || crypto.randomUUID()
      }));
      setHeaderItems(items);
    });
  }, []);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = headerItems.findIndex(i => i.id === active.id);
    const newIndex = headerItems.findIndex(i => i.id === over.id);
    const updated = arrayMove(headerItems, oldIndex, newIndex);
    setHeaderItems(updated);
  };

  const handleChange = (index, key, value) => {
    const updated = [...headerItems];
    updated[index][key] = value;
    setHeaderItems(updated);
  };

  const addNewItem = () => {
    const newItem = {
      id: crypto.randomUUID(),
      label: "",
      link: "",
      type: "internal",
      children: []
    };
    setHeaderItems([...headerItems, newItem]);
  };

  const saveMenu = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/menus/header`, { items: headerItems });
      toast({ title: "Header menu saved" });
    } catch (err) {
      toast({ title: "Failed to save header menu", variant: "destructive" });
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">Header Menu</h2>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={headerItems.map(i => i.id)} strategy={verticalListSortingStrategy}>
          {headerItems.map((item, index) => (
            <Card key={item.id} className="p-4 mb-2 space-y-2">
              <SortableItem key={item.id} id={item.id}>
                <div className="flex gap-2">
                  <Input
                    value={item.label}
                    onChange={(e) => handleChange(index, "label", e.target.value)}
                    placeholder="Label"
                  />
                  <Input
                    value={item.link}
                    onChange={(e) => handleChange(index, "link", e.target.value)}
                    placeholder="Link"
                  />
                  <select value={item.type} onChange={(e) => handleChange(index, "type", e.target.value)}>
                    <option value="internal">Internal</option>
                    <option value="external">External</option>
                  </select>
                </div>
              </SortableItem>
            </Card>
          ))}
        </SortableContext>
      </DndContext>
      <Button variant="outline" onClick={addNewItem}>+ Add Item</Button>
      <Button onClick={saveMenu}>Save Header</Button>
    </div>
  );
}
