// src/pages/admin-view/homepage.jsx — final working version with real sections + drag & drop

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  DndProvider,
  useDrag,
  useDrop,
} from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button } from "@/components/ui/button";
import SectionPreview from "@/components/admin-view/section-preview";
import AddSectionTile from "@/components/admin-view/add-section-tile";

const paletteTypes = [
  "slider",
  "product-slider",
  "category-grid",
  "theme-grid",
  "party-packages",
  "store-locations",
  "contact-info",
];

const DraggableSidebarItem = ({ type }) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "SECTION",
    item: { type, data: {} },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={dragRef}
      className={`cursor-grab bg-white border p-3 rounded shadow text-xs text-center ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      <AddSectionTile type={type} />
    </div>
  );
};

const ReorderableCanvasBlock = ({ block, index, moveBlock, onDelete }) => {
  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: "SECTION",
    hover(item, monitor) {
      if (!ref.current || item.fromPalette) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      moveBlock(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "SECTION",
    item: { ...block, index },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`bg-white border rounded p-4 shadow ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-semibold text-gray-700">
          {block.type}
        </span>
        <button
          onClick={() => onDelete(block.key)}
          className="text-red-500 hover:text-red-700 text-xs"
        >
          🗑️
        </button>
      </div>
      <SectionPreview type={block.type} data={block.data} />
    </div>
  );
};

export default function AdminHomepage() {
  const [canvasBlocks, setCanvasBlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/homepage-layout`);
        setCanvasBlocks((res.data || []).map((s) => ({ ...s, key: Date.now() + Math.random() })));
      } catch (err) {
        console.error("❌ Failed to fetch homepage layout", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSections();
  }, []);

  const saveLayout = async () => {
    const toSave = canvasBlocks.map(({ key, ...s }) => s);
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/homepage-layout`, { sections: toSave });
      alert("✅ Layout saved.");
    } catch (err) {
      console.error("❌ Failed to save layout", err);
      alert("❌ Failed to save layout");
    }
  };

  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: "SECTION",
    drop: (item) => {
      if (!item.index && item.type && item.data !== undefined) {
        setCanvasBlocks((prev) => [...prev, { ...item, key: Date.now() + Math.random() }]);
      }
    },
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  }));

  const moveBlock = (from, to) => {
    const updated = [...canvasBlocks];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setCanvasBlocks(updated);
  };

  const handleDelete = (key) => {
    setCanvasBlocks((prev) => prev.filter((block) => block.key !== key));
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-[260px] bg-gray-100 p-4 border-r overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Available Sections</h3>
          <div className="space-y-4">
            {paletteTypes.map((type) => (
              <DraggableSidebarItem key={type} type={type} />
            ))}
          </div>
        </aside>

        {/* Canvas */}
        <main className="flex-1 overflow-y-auto p-6 bg-white">
          <h2 className="text-2xl font-bold mb-2">Homepage Layout</h2>
          <p className="text-gray-600 text-sm mb-6">
            🧭 Drag a section from the sidebar and drop it below to build your homepage.
          </p>

          <div
            ref={dropRef}
            className={`min-h-[300px] border-2 p-6 rounded-md ${
              isOver ? "border-green-400 bg-green-50" : "border-dashed border-blue-300 bg-blue-50"
            }`}
          >
            {canvasBlocks.length === 0 ? (
              <div className="text-gray-400 text-sm text-center">
                Drop sections here to build your homepage layout.
              </div>
            ) : (
              canvasBlocks.map((block, index) => (
                <ReorderableCanvasBlock
                  key={block.key}
                  block={block}
                  index={index}
                  moveBlock={moveBlock}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>

          <div className="pt-6">
            <Button onClick={saveLayout}>💾 Save Layout</Button>
          </div>
        </main>
      </div>
    </DndProvider>
  );
}
