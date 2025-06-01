// File: Client/src/components/admin-view/ProductSearchSelector.jsx
import { useState, useEffect } from "react";
import { GripVertical, X } from "lucide-react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

function DraggableItem({ item, index, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item._id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between border rounded px-2 py-1 bg-white"
      {...attributes}
    >
      <div className="flex items-center gap-2">
        <GripVertical className="w-4 h-4 cursor-move" {...listeners} />
        <div className="text-sm">{item.title || "Untitled"} {item.price ? `– AED ${item.price}` : ""}</div>
      </div>
      <button onClick={() => onRemove(index)}>
        <X className="w-4 h-4 text-red-500" />
      </button>
    </div>
  );
}

export default function ProductSearchSelector({ value = [], onChange }) {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.length > 1) {
        axios
          .get(`${import.meta.env.VITE_API_URL}/api/products/search?query=${query}`)
          .then((res) => {
            if (res.data?.success) setResults(res.data.data);
          });
      } else {
        setResults([]);
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [query]);

  const handleAdd = (product) => {
    if (value.some((p) => p._id === product._id)) {
      toast({ title: "Already added" });
      return;
    }
    onChange([...value, product]);
    setQuery("");
    setResults([]);
  };

  const handleRemove = (index) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = value.findIndex((p) => p._id === active.id);
      const newIndex = value.findIndex((p) => p._id === over.id);
      onChange(arrayMove(value, oldIndex, newIndex));
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border rounded px-2 py-1"
      />
      {results.length > 0 && (
        <ul className="border bg-white rounded divide-y">
          {results.map((p) => (
            <li
              key={p._id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleAdd(p)}
            >
              {p.title} {p.price ? `– AED ${p.price}` : ""}
            </li>
          ))}
        </ul>
      )}

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis]}>
        <SortableContext items={value.map((item) => item._id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {value.map((item, idx) => (
              <DraggableItem key={item._id} item={item} index={idx} onRemove={handleRemove} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
