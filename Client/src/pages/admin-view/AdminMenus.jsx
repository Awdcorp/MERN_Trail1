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
        id: item.id || crypto.randomUUID(),
        children: (item.children || []).map(child => ({
          ...child,
          id: child.id || crypto.randomUUID(),
          children: (child.children || []).map(sub => ({
            ...sub,
            id: sub.id || crypto.randomUUID(),
          }))
        }))
      }));
      setHeaderItems(items);
    });
  }, []);

  const handleDragEnd = (event, list, updateFn) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = list.findIndex(i => i.id === active.id);
    const newIndex = list.findIndex(i => i.id === over.id);
    const updated = arrayMove(list, oldIndex, newIndex);
    updateFn(updated);
  };

  const handleChange = (list, setList, index, key, value) => {
    const updated = [...list];
    updated[index][key] = value;
    setList(updated);
  };

  const addItem = (list, setList) => {
    const newItem = {
      id: crypto.randomUUID(),
      label: "",
      link: "",
      type: "internal",
      children: []
    };
    setList([...list, newItem]);
  };

  const saveMenu = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/menus/header`, { items: headerItems });
      toast({ title: "Header menu saved" });
    } catch (err) {
      toast({ title: "Failed to save header menu", variant: "destructive" });
    }
  };

  const renderChildren = (children, setChildren, level = 1) => (
    <div className={`ml-${level * 4} mt-3 space-y-2`}>
      <DndContext collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, children, setChildren)}>
        <SortableContext items={children.map(i => i.id)} strategy={verticalListSortingStrategy}>
          {children.map((child, cIndex) => (
            <Card key={child.id} className="p-3">
              <SortableItem id={child.id}>
                <div className="flex gap-2">
                  <Input
                    value={child.label}
                    onChange={(e) => handleChange(children, setChildren, cIndex, "label", e.target.value)}
                    placeholder="Label"
                  />
                  <Input
                    value={child.link}
                    onChange={(e) => handleChange(children, setChildren, cIndex, "link", e.target.value)}
                    placeholder="Link"
                  />
                  <select
                    value={child.type}
                    onChange={(e) => handleChange(children, setChildren, cIndex, "type", e.target.value)}
                  >
                    <option value="internal">Internal</option>
                    <option value="external">External</option>
                  </select>
                </div>
                {renderChildren(child.children || [], updated => {
                  child.children = updated;
                  setChildren([...children]);
                }, level + 1)}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const newChild = {
                      id: crypto.randomUUID(),
                      label: "",
                      link: "",
                      type: "internal",
                      children: []
                    };
                    child.children = [...(child.children || []), newChild];
                    setChildren([...children]);
                  }}
                >
                  + Add Subitem
                </Button>
              </SortableItem>
            </Card>
          ))}
        </SortableContext>
      </DndContext>
      <Button size="sm" variant="outline" onClick={() => addItem(children, setChildren)}>
        + Add Child
      </Button>
    </div>
  );

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">Header Menu</h2>
      <DndContext collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, headerItems, setHeaderItems)}>
        <SortableContext items={headerItems.map(i => i.id)} strategy={verticalListSortingStrategy}>
          {headerItems.map((item, index) => (
            <Card key={item.id} className="p-4 mb-2 space-y-2">
              <SortableItem id={item.id}>
                <div className="flex gap-2">
                  <Input
                    value={item.label}
                    onChange={(e) => handleChange(headerItems, setHeaderItems, index, "label", e.target.value)}
                    placeholder="Label"
                  />
                  <Input
                    value={item.link}
                    onChange={(e) => handleChange(headerItems, setHeaderItems, index, "link", e.target.value)}
                    placeholder="Link"
                  />
                  <select
                    value={item.type}
                    onChange={(e) => handleChange(headerItems, setHeaderItems, index, "type", e.target.value)}
                  >
                    <option value="internal">Internal</option>
                    <option value="external">External</option>
                  </select>
                </div>
                {renderChildren(item.children, updated => {
                  item.children = updated;
                  setHeaderItems([...headerItems]);
                })}
              </SortableItem>
            </Card>
          ))}
        </SortableContext>
      </DndContext>
      <Button variant="outline" onClick={() => addItem(headerItems, setHeaderItems)}>+ Add Top Level</Button>
      <Button onClick={saveMenu}>Save Header</Button>
    </div>
  );
}