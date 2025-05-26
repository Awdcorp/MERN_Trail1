// File: Client/src/pages/admin-view/AdminMenus.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import SortableItem from "@/components/admin-view/sortable-item";
import { GripVertical, Trash, Plus, ChevronDown, ChevronUp } from "lucide-react"; // Import icons

export default function AdminMenus() {
  const { toast } = useToast();
  const [menuName, setMenuName] = useState("header");
  const [headerItems, setHeaderItems] = useState([]);
  const [collapsed, setCollapsed] = useState({});

  const toggleCollapse = (id) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const sanitizeItems = (items) => {
    const walk = (arr) =>
      arr.map(({ id, ...rest }) => ({
        ...rest,
        children: rest.children ? walk(rest.children) : [],
      }));
    return walk(items);
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
    setCollapsed((prev) =>
      Object.fromEntries(Object.keys(prev).map((k) => [k, false]))
    );
  };

  const collapseAll = () => {
    setCollapsed((prev) =>
      Object.fromEntries(Object.keys(prev).map((k) => [k, true]))
    );
  };

  const updateActiveMenuSetting = async (value) => {
    try {
      console.log("📤 Setting activeHeaderMenu in Settings:", value);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/menus/active-header`,
        { name: value }
      );
      toast({ title: `Live menu set to ${value}` });
    } catch (err) {
      console.error("❌ Failed to update activeHeaderMenu", err);
      toast({ title: "Failed to set active menu", variant: "destructive" });
    }
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/admin/menus/${menuName}`)
      .then((res) => {
        const items = (res.data.items || []).map((item) => ({
          ...item,
          id: item.id || crypto.randomUUID(),
          children: (item.children || []).map((child) => ({
            ...child,
            id: child.id || crypto.randomUUID(),
            children: (child.children || []).map((sub) => ({
              ...sub,
              id: sub.id || crypto.randomUUID(),
            })),
          })),
        }));
        setHeaderItems(items);
        setCollapsed(collectAllIds(items));
      });
  }, [menuName]);

  const handleDragEnd = (event, list, updateFn) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = list.findIndex((i) => i.id === active.id);
    const newIndex = list.findIndex((i) => i.id === over.id);
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
      children: [],
    };
    setList([...list, newItem]);
  };

  const saveMenu = async () => {
    console.log("💾 Saving menu:", menuName); // ADD THIS LINE TO LOG IT

    if (headerItems.some((i) => !i.label || !i.link)) {
      toast({
        title: "All menu items must have a label and link",
        variant: "destructive",
      });
      return;
    }
    try {
      const sanitized = sanitizeItems(headerItems);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/menus/${menuName}`,
        {
          items: sanitized,
        }
      );
      toast({ title: `${menuName} saved successfully` });
    } catch (err) {
      toast({ title: `Failed to save ${menuName}`, variant: "destructive" });
    }
  };

  const renderChildren = (children, setChildren, level = 1) => (
    <div className={`ml-${level * 4} mt-2 space-y-2 border-l border-muted pl-4`}>
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={(e) => handleDragEnd(e, children, setChildren)}
      >
        <SortableContext
          items={children.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          {children.map((child, cIndex) => (
            <Card key={child.id} className="p-2 bg-muted/40">
              <SortableItem id={child.id}>
                <div className="flex gap-2 items-center">
                  <span className="cursor-grab">
                    <GripVertical className="w-3 h-3 text-gray-500" />
                  </span>
                  {child.children && child.children.length > 0 && (
                    <button onClick={() => toggleCollapse(child.id)} className="mt-0.5">
                      {collapsed[child.id] ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                    </button>
                  )}
                  <Input
                    size="sm"
                    value={child.label}
                    onChange={(e) =>
                      handleChange(
                        children,
                        setChildren,
                        cIndex,
                        "label",
                        e.target.value
                      )
                    }
                    placeholder="Label"
                    className="text-sm"
                  />
                  <Input
                    size="sm"
                    value={child.link}
                    onChange={(e) =>
                      handleChange(
                        children,
                        setChildren,
                        cIndex,
                        "link",
                        e.target.value
                      )
                    }
                    placeholder="Link"
                    className="text-sm"
                  />
                  <select
                    value={child.type}
                    onChange={(e) =>
                      handleChange(
                        children,
                        setChildren,
                        cIndex,
                        "type",
                        e.target.value
                      )
                    }
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="internal">Internal</option>
                    <option value="external">External</option>
                  </select>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteItem(children, setChildren, cIndex)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
                {!collapsed[child.id] &&
                  renderChildren(
                    child.children || [],
                    (updated) => {
                      child.children = updated;
                      setChildren([...children]);
                    },
                    level + 1
                  )}
                <div className="mt-1 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const newChild = {
                        id: crypto.randomUUID(),
                        label: "",
                        link: "",
                        type: "internal",
                        children: [],
                      };
                      child.children = [...(child.children || []), newChild];
                      setChildren([...children]);
                    }}
                    className="text-sm"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Subitem
                  </Button>
                </div>
              </SortableItem>
            </Card>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Header Menu</h2>
        <div className="flex gap-2 items-center">
          <select
            value={menuName}
            onChange={(e) => setMenuName(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="header">Header</option>
            <option value="menu1">Menu 1</option>
            <option value="menu2">Menu 2</option>
            <option value="menu3">Menu 3</option>
          </select>
          <Button
            size="sm"
            variant="outline"
            onClick={() => updateActiveMenuSetting(menuName)}
          >
            Set as Active
          </Button>
          <Button size="sm" variant="outline" onClick={expandAll}>
            Expand All
          </Button>
          <Button size="sm" variant="outline" onClick={collapseAll}>
            Collapse All
          </Button>
        </div>
      </div>

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={(e) => handleDragEnd(e, headerItems, setHeaderItems)}
      >
        <SortableContext
          items={headerItems.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          {headerItems.map((item, index) => (
            <Card key={item.id} className="p-2 mb-2 border shadow-sm bg-white">
              <SortableItem id={item.id}>
                <div className="flex gap-2 items-center">
                  <span className="cursor-grab">
                    <GripVertical className="w-3 h-3 text-gray-500" />
                  </span>
                  {item.children && item.children.length > 0 && (
                    <button onClick={() => toggleCollapse(item.id)} className="mt-0.5">
                      {collapsed[item.id] ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                    </button>
                  )}
                  <Input
                    size="sm"
                    value={item.label}
                    onChange={(e) =>
                      handleChange(
                        headerItems,
                        setHeaderItems,
                        index,
                        "label",
                        e.target.value
                      )
                    }
                    placeholder="Label"
                    className="text-sm"
                  />
                  <Input
                    size="sm"
                    value={item.link}
                    onChange={(e) =>
                      handleChange(
                        headerItems,
                        setHeaderItems,
                        index,
                        "link",
                        e.target.value
                      )
                    }
                    placeholder="Link"
                    className="text-sm"
                  />
                  <select
                    value={item.type}
                    onChange={(e) =>
                      handleChange(
                        headerItems,
                        setHeaderItems,
                        index,
                        "type",
                        e.target.value
                      )
                    }
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="internal">Internal</option>
                    <option value="external">External</option>
                  </select>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteItem(headerItems, setHeaderItems, index)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
                {!collapsed[item.id] &&
                  renderChildren(
                    item.children,
                    (updated) => {
                      item.children = updated;
                      setHeaderItems([...headerItems]);
                    }
                  )}
              </SortableItem>
            </Card>
          ))}
        </SortableContext>
      </DndContext>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => addItem(headerItems, setHeaderItems)}
          className="text-sm"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Top Level
        </Button>
        <Button onClick={saveMenu} className="text-sm">
          Save {menuName}
        </Button>
      </div>
    </div>
  );
}
