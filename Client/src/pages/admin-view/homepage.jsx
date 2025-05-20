import { useState, useRef, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import axios from "axios";
import { GripVertical } from 'lucide-react';

const ItemTypes = { BLOCK: "BLOCK" };
const paletteBlocks = [
  { id: "hero", label: "Hero Banner", type: "slider" },
  { id: "features", label: "Features Grid", type: "category-grid" },
  { id: "testimonial", label: "Testimonials", type: "testimonial" },
  { id: "cta", label: "Call to Action", type: "cta" },
];

const BlockPreview = ({ label }) => (
  <div className="border border-gray-300 bg-white rounded p-4 text-center shadow-sm text-sm">
    {label}
  </div>
);

const DraggablePaletteItem = ({ block }) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: ItemTypes.BLOCK,
    item: () => ({ ...block, fromPalette: true }),  // [FIX] Always return a fresh item clone so block.fromPalette isn't mutated
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));

  return (
    <div
      ref={dragRef}
      className={`cursor-grab transition hover:bg-indigo-50 bg-white border border-gray-200 p-2 rounded shadow-sm text-xs text-center flex items-center justify-center ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      <span className="select-none text-indigo-700 font-medium">{block.label}</span>
    </div>
  );
};

const ReorderableCanvasBlock = ({ block, index, moveBlock, onDelete, onDropAt }) => {
  const ref = useRef(null);
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemTypes.BLOCK,
    canDrop: (item) => item.fromPalette,
    drop: (item) => {
      onDropAt(item, index);
      item.fromPalette = false;
    },
    hover: (item, monitor) => {
      if (!ref.current || item.fromPalette) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      const { top, bottom } = ref.current.getBoundingClientRect();
      const hoverMiddleY = (bottom - top) / 2;
      const { y } = monitor.getClientOffset() || {};
      const hoverClientY = y - top;
      if ((dragIndex < hoverIndex && hoverClientY < hoverMiddleY) ||
          (dragIndex > hoverIndex && hoverClientY > hoverMiddleY)) return;
      moveBlock(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    collect: (monitor) => ({ isOver: monitor.isOver({ shallow: true }), canDrop: monitor.canDrop() }),
  });
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.BLOCK,
    item: { ...block, index, fromPalette: false },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });
  drag(drop(ref));
  return (
    <div
      ref={ref}
      className={`relative flex items-start transition-shadow bg-white border border-gray-200 rounded p-4 shadow-sm ${
        isDragging ? "opacity-50 shadow-lg" : "hover:shadow-md"
      } ${isOver && canDrop ? "border-2 border-indigo-600 bg-indigo-100" : ""}`}
    >
      <GripVertical className="w-5 h-5 mr-3 text-gray-400" />
      <div className="flex-1">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-sm select-none text-gray-800">{block.label}</span>
          <button onClick={() => onDelete(block.key)} className="text-red-500 hover:text-red-700 text-sm">
            🗑️
          </button>
        </div>
        <BlockPreview label={block.label} />
      </div>
    </div>
  );
};

const DropZone = ({ canvasBlocks, onDropAt, onDelete, moveBlock }) => {
  const ref = useRef(null);
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemTypes.BLOCK,
    canDrop: (item) => item.fromPalette,
    drop: (item, monitor) => {
      if (!monitor.didDrop()) {
        onDropAt(item, canvasBlocks.length);
        item.fromPalette = false;
      }
    },
    hover: (_, monitor) => {
      const node = ref.current;
      if (node && monitor.isOver({ shallow: true })) {
        const { top, bottom } = node.getBoundingClientRect();
        const { y } = monitor.getClientOffset() || {};
        const scrollZone = 80;
        const scrollSpeed = 15;
        if (y < top + scrollZone) node.scrollBy({ top: -scrollSpeed });
        if (y > bottom - scrollZone) node.scrollBy({ top: scrollSpeed });
      }
    },
    collect: (monitor) => ({ isOver: monitor.isOver({ shallow: true }), canDrop: monitor.canDrop() }),
  });
  drop(ref);
  return (
    <div
      ref={ref}
      className={`relative z-10 flex-1 p-6 space-y-4 overflow-auto border-2 border-dashed rounded transition-colors ${
        isOver && canDrop ? "border-indigo-600 bg-indigo-50" : "border-gray-300 bg-gray-100"
      }`}
      style={{ minHeight: '80vh' }}
    >
      {canvasBlocks.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-12 select-none">
          Drag blocks here to build your layout
        </p>
      ) : (
        canvasBlocks.map((block, index) => (
          <ReorderableCanvasBlock
            key={block.key}
            block={block}
            index={index}
            moveBlock={moveBlock}
            onDelete={onDelete}
            onDropAt={onDropAt}
          />
        ))
      )}
    </div>
  );
};

export default function EditorPlayground() {
  const [canvasBlocks, setCanvasBlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDropAt = (block, atIndex) => {
    const newBlock = { ...block, key: Date.now() + Math.random(), data: block.data || {}, fromPalette: false };
    setCanvasBlocks((prev) => {
      const updated = [...prev];
      updated.splice(atIndex, 0, newBlock);
      return updated;
    });
  };

  const handleDelete = (keyToRemove) => setCanvasBlocks((prev) => prev.filter((b) => b.key !== keyToRemove));

  const moveBlock = (from, to) => setCanvasBlocks((prev) => {
    const updated = [...prev];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    return updated;
  });

  const fetchLayout = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/homepage-layout`);
      const loaded = res.data?.map((section, idx) => ({
        id: `${section.type}-${idx}`,
        label: paletteBlocks.find((p) => p.type === section.type)?.label || section.type,
        type: section.type,
        data: section.data || {},
        key: Date.now() + idx,
        fromPalette: false,
      })) || [];
      setCanvasBlocks(loaded);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveLayout = async () => {
    const payload = canvasBlocks.map((b) => ({ type: b.type, data: b.data || {} }));
    await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/homepage-layout`, { sections: payload });
    alert("Layout saved! 足");
  };

  useEffect(fetchLayout, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex min-h-screen">
        <aside className="w-72 border-r bg-white p-4 flex flex-col sticky top-0 h-screen overflow-auto">
          <div className="space-y-4">
            <h2 className="font-semibold text-sm text-gray-700">Blocks</h2>
            {paletteBlocks.map((block) => (
              <DraggablePaletteItem key={block.id} block={block} />
            ))}
          </div>
          <button
            onClick={saveLayout}
            className="mt-auto bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition"
          >
            Save Layout
          </button>
        </aside>
        <main className="flex-1 overflow-auto bg-gray-50">
          {loading ? (
            <p className="text-gray-500 text-sm text-center py-12">Loading...</p>
          ) : (
            <DropZone
              canvasBlocks={canvasBlocks}
              onDropAt={handleDropAt}
              onDelete={handleDelete}
              moveBlock={moveBlock}
            />
          )}
        </main>
      </div>
    </DndProvider>
  );
}
