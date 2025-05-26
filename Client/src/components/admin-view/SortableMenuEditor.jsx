// File: Client/src/components/admin-view/SortableMenuEditor.jsx

import { useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import SortableItem from "./sortable-item";

export default function SortableMenuEditor({ items = [], onChange }) {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDragEnd = (level, event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const index = (list) => list.findIndex((i) => i.id === active.id);
    const copy = [...items];
    const newList = arrayMove(copy, index(copy), index(copy.filter(i => i.id !== active.id).concat(copy[index(copy)])));
    onChange(newList);
  };

  const updateItem = (index, key, value) => {
    const copy = [...items];
    copy[index][key] = value;
    onChange(copy);
  };

  const addItem = () => {
    const newItem = {
      id: crypto.randomUUID(),
      label: "",
      link: "",
      type: "internal",
      children: [],
    };
    onChange([...items, newItem]);
  };

  const addChild = (index) => {
    const copy = [...items];
    copy[index].children = copy[index].children || [];
    copy[index].children.push({
      id: crypto.randomUUID(),
      label: "",
      link: "",
      type: "internal",
      children: [],
    });
    onChange(copy);
  };

  const renderItems = (list, level = 0, parentIdx = -1) => (
    <DndContext collisionDetection={closestCenter} onDragEnd={(event) => handleDragEnd(level, event)}>
      <SortableContext items={list.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        {list.map((item, index) => (
          <Card key={item.id} className={`p-4 my-2 space-y-2 ml-${level * 4}`}>
            <SortableItem id={item.id}>
              <div className="flex gap-2">
                <Input
                  value={item.label}
                  onChange={(e) => {
                    const idx = parentIdx > -1 ? parentIdx : index;
                    updateItem(idx, "label", e.target.value);
                  }}
                  placeholder="Label"
                />
                <Input
                  value={item.link}
                  onChange={(e) => {
                    const idx = parentIdx > -1 ? parentIdx : index;
                    updateItem(idx, "link", e.target.value);
                  }}
                  placeholder="Link"
                />
                <select
                  value={item.type}
                  onChange={(e) => {
                    const idx = parentIdx > -1 ? parentIdx : index;
                    updateItem(idx, "type", e.target.value);
                  }}
                >
                  <option value="internal">Internal</option>
                  <option value="external">External</option>
                </select>
                <Button size="sm" variant="outline" onClick={() => toggleExpand(item.id)}>
                  {expanded[item.id] ? "Hide" : "Show"} Submenu
                </Button>
                <Button size="sm" onClick={() => addChild(index)}>+ Sub</Button>
              </div>
              {expanded[item.id] && item.children?.length > 0 && (
                <div className="pl-4 mt-2">
                  {renderItems(item.children, level + 1, index)}
                </div>
              )}
            </SortableItem>
          </Card>
        ))}
      </SortableContext>
    </DndContext>
  );

  return (
    <div>
      {renderItems(items)}
      <Button variant="outline" onClick={addItem}>+ Add Top Item</Button>
    </div>
  );
}