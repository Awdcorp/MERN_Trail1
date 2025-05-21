import { useState, useRef, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import axios from "axios";
import { GripVertical } from "lucide-react";

import LiveSectionRenderer from "@/components/admin-view/LiveSectionRenderer";
import AddSectionTile from "@/components/admin-view/add-section-tile";
import SectionSettingsPanel from "@/components/admin-view/SectionSettingsPanel";

const ItemTypes = { BLOCK: "BLOCK" };

const paletteTypes = [
  "slider",
  "product-slider",
  "category-grid",
  "theme-grid",
  "party-packages",
  "store-locations",
  "contact-info",
];

const defaultDataMap = {
  "slider": {},
  "product-slider": { title: "New Arrivals", limit: 8 },
  "category-grid": { title: "Shop by Category", categories: [] },
  "theme-grid": { title: "Themes", themes: [] },
  "party-packages": { packages: [] },
  "store-locations": { stores: [] },
  "contact-info": {
    phones: [],
    whatsapp: [],
    buttonText: "",
    buttonLink: ""
  }
};

const DraggablePaletteItem = ({ block }) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: ItemTypes.BLOCK,
    item: () => ({ ...block, fromPalette: true }),
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));

  return (
    <div
      ref={dragRef}
      className={`cursor-grab bg-white border p-3 rounded shadow text-xs text-center ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      <AddSectionTile type={block.type} />
    </div>
  );
};

const ReorderableCanvasBlock = ({ block, index, moveBlock, onDelete, onDropAt, onEdit }) => {
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
      if (
        (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) ||
        (dragIndex > hoverIndex && hoverClientY > hoverMiddleY)
      )
        return;
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

  console.log("Rendering block:", block);

  return (
    <div
      ref={ref}
      className={`relative bg-white border border-gray-200 rounded p-4 shadow-sm transition-shadow
        ${isDragging ? "opacity-50 shadow-lg" : "hover:shadow-md"}
        ${isOver && canDrop ? "border-2 border-indigo-600 bg-indigo-100" : ""}
      `}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-sm select-none text-gray-800">{block.type}</span>
        <div className="space-x-2">
          <button onClick={() => onEdit(block.key)} className="text-indigo-600 hover:text-indigo-800 text-sm">✏️ Edit</button>
          <button onClick={() => onDelete(block.key)} className="text-red-500 hover:text-red-700 text-sm">🗑️</button>
        </div>
      </div>
      <LiveSectionRenderer type={block.type} data={block.data} />
    </div>
  );
};


const DropZone = ({ canvasBlocks, onDropAt, onDelete, moveBlock, onEdit }) => {
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
      style={{ minHeight: "80vh" }}
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
            onEdit={onEdit}
          />
        ))
      )}
    </div>
  );
};

export default function EditorPlayground() {
  const [canvasBlocks, setCanvasBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBlock, setEditingBlock] = useState(null);

  const handleDropAt = (block, atIndex) => {
    const newBlock = {
      ...block,
      key: Date.now() + Math.random(),
      data: defaultDataMap[block.type] || {},
      fromPalette: false
    };
    setCanvasBlocks((prev) => {
      const updated = [...prev];
      updated.splice(atIndex, 0, newBlock);
      return updated;
    });
  };

  const handleEditBlock = (blockKey) => {
    const target = canvasBlocks.find((b) => b.key === blockKey);
    if (target) setEditingBlock(target);
  };

  const handleSaveBlock = (blockKey, newData) => {
    setCanvasBlocks((prev) =>
      prev.map((b) => (b.key === blockKey ? { ...b, data: newData } : b))
    );
    setEditingBlock(null);
  };

  const handleDelete = (keyToRemove) => setCanvasBlocks((prev) => prev.filter((b) => b.key !== keyToRemove));

  const moveBlock = (from, to) =>
    setCanvasBlocks((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(from, 1);
      updated.splice(to, 0, moved);
      return updated;
    });

  const fetchLayout = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/homepage-layout`);
      const loaded =
        res.data?.map((section, idx) => ({
          id: `${section.type}-${idx}`,
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
    alert("Layout saved! ✅");
  };

  useEffect(fetchLayout, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex min-h-screen">
        <aside className="w-72 h-screen bg-white flex flex-col border-r sticky top-0">
  {/* Scrollable block list */}
  <div className="flex-1 overflow-y-auto p-4">
    <h2 className="font-semibold text-sm text-gray-700 mb-4">Blocks</h2>
    <div className="space-y-4">
      {paletteTypes.map((type) => (
        <DraggablePaletteItem key={type} block={{ type }} />
      ))}
    </div>
  </div>

  {/* Sticky footer */}
  <div className="p-4 border-t bg-white">
    <button
      onClick={saveLayout}
      className="w-full bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition"
    >
      Save Layout
    </button>
  </div>
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
              onEdit={handleEditBlock}
            />
          )}
        </main>

        <SectionSettingsPanel
          block={editingBlock}
          onSave={handleSaveBlock}
          onCancel={() => setEditingBlock(null)}
        />
      </div>
    </DndProvider>
  );
}