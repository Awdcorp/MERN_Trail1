import { useDraggable } from "@dnd-kit/core";
import SectionPreview from "./section-preview";

export default function AddSectionTile({ type }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `add-${type}`,
    data: {
      fromPalette: true,
      section: { type, data: {} }
    }
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 50,
        position: "absolute"
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="cursor-grab active:cursor-grabbing"
    >
      <SectionPreview type={type} />
    </div>
  );
}
