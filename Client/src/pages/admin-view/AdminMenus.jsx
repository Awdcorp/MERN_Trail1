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
  const [collapsed, setCollapsed] = useState({});

  const toggleCollapse = (id) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const collectAllIds = (items) => {
    const ids = {};
    const walk = (arr) => {
      arr.forEach((item) => {
        ids[item.id] = true;
        if (item.children?.length) walk(item.children);
      });
    };
    walk(items);
    return ids;
  };

  const expandAll = () => {
    setCollapsed((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((k) => (updated[k] = false));
      return updated;
    });
  };

  const collapseAll = () => {
    setCollapsed((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((k) => (updated[k] = true));
      return updated;
    });
  };

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
      setCollapsed(collectAllIds(items));
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

  const deleteItem = (list, setList, index) => {
    const updated = [...list];
    updated.splice(index, 1);
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
    <div className={`ml-${level * 4} mt-3 space-y-3 border-l border-muted pl-4`}>
      <DndContext collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, children, setChildren)}>
        <SortableContext items={children.map(i => i.id)} strategy={verticalListSortingStrategy}>
          {children.map((child, cIndex) => (
            <Card key={child.id} className="p-3 bg-muted/40">
              <SortableItem id={child.id}>
                <div className="flex gap-2 items-start">
                  {child.children && child.children.length > 0 && (
                    <button onClick={() => toggleCollapse(child.id)} className="mt-2">
                      {collapsed[child.id] ? "▶" : "▼"}
                    </button>
                  )}
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
                  <Button size="sm" variant="ghost" onClick={() => deleteItem(children, setChildren, cIndex)}>🗑</Button>
                </div>
                {!collapsed[child.id] && renderChildren(child.children || [], updated => {
                  child.children = updated;
                  setChildren([...children]);
                }, level + 1)}
                <div className="mt-2 flex gap-2">
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
                </div>
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
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Header Menu</h2>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={expandAll}>Expand All</Button>
          <Button size="sm" variant="outline" onClick={collapseAll}>Collapse All</Button>
        </div>
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, headerItems, setHeaderItems)}>
        <SortableContext items={headerItems.map(i => i.id)} strategy={verticalListSortingStrategy}>
          {headerItems.map((item, index) => (
            <Card key={item.id} className="p-4 mb-3 border shadow-sm bg-white">
              <SortableItem id={item.id}>
                <div className="flex gap-2 items-start">
                  {item.children && item.children.length > 0 && (
                    <button onClick={() => toggleCollapse(item.id)} className="mt-2">
                      {collapsed[item.id] ? "▶" : "▼"}
                    </button>
                  )}
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
                  <Button size="sm" variant="ghost" onClick={() => deleteItem(headerItems, setHeaderItems, index)}>🗑</Button>
                </div>
                {!collapsed[item.id] && renderChildren(item.children, updated => {
                  item.children = updated;
                  setHeaderItems([...headerItems]);
                })}
              </SortableItem>
            </Card>
          ))}
        </SortableContext>
      </DndContext>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => addItem(headerItems, setHeaderItems)}>+ Add Top Level</Button>
        <Button onClick={saveMenu}>Save Header</Button>
      </div>
    </div>
  );
}