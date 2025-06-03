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
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import SortableItem from "@/components/admin-view/sortable-item";
import {
  GripVertical,
  Trash,
  Plus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

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
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/menus/active-header`,
        { name: value }
      );
      toast({ title: `Live menu set to ${value}` });
    } catch (err) {
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
        { items: sanitized }
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
                  {child.children?.length > 0 && (
                    <button onClick={() => toggleCollapse(child.id)} className="mt-0.5">
                      {collapsed[child.id] ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                    </button>
                  )}
                  <Input
                    size="sm"
                    value={child.label}
                    onChange={(e) =>
                      handleChange(children, setChildren, cIndex, "label", e.target.value)
                    }
                    placeholder="Label"
                    className="text-sm"
                  />
                  <Input
                    size="sm"
                    value={child.link}
                    onChange={(e) =>
                      handleChange(children, setChildren, cIndex, "link", e.target.value)
                    }
                    placeholder="Link"
                    className="text-sm"
                  />
                  <select
                    value={child.type}
                    onChange={(e) =>
                      handleChange(children, setChildren, cIndex, "type", e.target.value)
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

                <div className="mt-2">
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
  <div className="max-w-5xl p-6 mx-auto space-y-6">
    {/* 🔷 Page Title + Controls */}
    <div className="flex flex-wrap justify-between items-center">
      <h2 className="text-2xl font-semibold">Header Menu</h2>
      <div className="flex flex-wrap gap-2 items-center mt-2 sm:mt-0">
        <select
          value={menuName}
          onChange={(e) => setMenuName(e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="header">Header</option>
          <option value="menu1">Menu 1</option>
          <option value="menu2">Menu 2</option>
          <option value="menu3">Menu 3</option>
        </select>
        <Button size="sm" variant="outline" onClick={() => updateActiveMenuSetting(menuName)}>
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

    {/* 🧩 Main Card for Menu Items */}
    <Card>
      <CardContent className="space-y-6 pt-6">
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={(e) => handleDragEnd(e, headerItems, setHeaderItems)}
        >
          <SortableContext
            items={headerItems.map((i) => i.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {headerItems.map((item, index) => (
                <Card key={item.id} className="p-2 bg-white border shadow-sm">
                  <SortableItem id={item.id}>
                    <div className="flex gap-2 items-center">
                      <span className="cursor-grab">
                        <GripVertical className="w-3 h-3 text-gray-500" />
                      </span>
                      {item.children?.length > 0 && (
                        <button onClick={() => toggleCollapse(item.id)} className="mt-0.5">
                          {collapsed[item.id] ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                        </button>
                      )}
                      <Input
                        size="sm"
                        value={item.label}
                        onChange={(e) =>
                          handleChange(headerItems, setHeaderItems, index, "label", e.target.value)
                        }
                        placeholder="Label"
                        className="text-sm"
                      />
                      <Input
                        size="sm"
                        value={item.link}
                        onChange={(e) =>
                          handleChange(headerItems, setHeaderItems, index, "link", e.target.value)
                        }
                        placeholder="Link"
                        className="text-sm"
                      />
                      <select
                        value={item.type}
                        onChange={(e) =>
                          handleChange(headerItems, setHeaderItems, index, "type", e.target.value)
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
            </div>
          </SortableContext>
        </DndContext>

        {/* 🧷 Bottom Buttons */}
        <div className="flex gap-3 pt-2">
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
      </CardContent>
    </Card>
  </div>
);

}
