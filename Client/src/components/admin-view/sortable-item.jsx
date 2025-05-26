import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

export default function SortableItem({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-start gap-2">
      <button {...attributes} {...listeners} className="cursor-grab mt-2">
        <GripVertical className="text-muted-foreground" />
      </button>
      <div className="flex-1">{children}</div>
    </div>
  );
}
