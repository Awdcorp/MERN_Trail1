import { useEffect, useState, useRef } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import axios from "axios";
import { Settings } from "lucide-react";

import LiveSectionRenderer from "@/components/admin-view/LiveSectionRenderer";
import AddSectionTile from "@/components/admin-view/add-section-tile";
import SectionSettingsPanel from "@/components/admin-view/SectionSettingsPanel";

const ItemTypes = { BLOCK: "BLOCK" };

const paletteTypes = [
  "layout-section",
  "text",
  "slider",
  "product-slider",
  "category-grid",
  "theme-grid",
  "party-packages",
  "store-locations",
  "contact-info"
];

const defaultDataMap = {
  "layout-section": {
    layout: "2-column",
    elements: [[], []],
    columnWidths: [50, 50],
    padding: "1rem",
    gap: "0.5rem",
    backgroundColor: "#ffffff",
    customClass: "",
    columnStyles: [],
    margin: "",
    borderWidth: "",
    borderColor: "",
    borderStyle: "",
    borderRadius: "",
    boxShadow: "",
    backgroundImage: "",
    label: "",
    collapsed: false,
    visibility: "all"
  },
  text: {
    html: "<p>Edit me</p>"
  },
  slider: {},
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

export default function GenericPageBuilder({ fetchUrl, saveUrl, slug = null }) {
  const [canvasBlocks, setCanvasBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBlock, setEditingBlock] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);

  const handleLiveUpdate = (blockKey, newData) => {
    setCanvasBlocks((prev) =>
      prev.map((b) => (b.key === blockKey ? { ...b, data: newData } : b))
    );
    if (editingBlock?.key === blockKey) {
      setEditingBlock((prev) => ({ ...prev, data: newData }));
    }
  };

  const resizeColumns = (sectionKey, newWidths) => {
    setCanvasBlocks((prev) =>
      prev.map((b) =>
        b.key === sectionKey ? { ...b, data: { ...b.data, columnWidths: newWidths } } : b
      )
    );
    if (editingBlock?.key === sectionKey) {
      setEditingBlock((prev) => ({ ...prev, data: { ...prev.data, columnWidths: newWidths } }));
    }
  };

  const dropTextIntoColumn = (sectionKey, columnIndex, textElement) => {
    setCanvasBlocks((prev) =>
      prev.map((b) => {
        if (b.key !== sectionKey) return b;
        const newElements = [...(b.data.elements || [])];
        newElements[columnIndex] = [...(newElements[columnIndex] || []), textElement];
        return { ...b, data: { ...b.data, elements: newElements } };
      })
    );
  };

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

  const handleEditBlock = (blockKey, override = {}) => {
    const target = canvasBlocks.find((b) => b.key === blockKey);
    if (target) {
      const updated = { ...target, data: { ...target.data, ...override } };
      setEditingBlock(updated);
      setShowSidebar(true);

      if (override.collapsed !== undefined) {
        setCanvasBlocks((prev) =>
          prev.map((b) => (b.key === blockKey ? updated : b))
        );
      }
    }
  };

  const handleSaveBlock = (blockKey, newData) => {
    setCanvasBlocks((prev) =>
      prev.map((b) => (b.key === blockKey ? { ...b, data: newData } : b))
    );
    setEditingBlock(null);
    setShowSidebar(false);
  };

  const handleDelete = (keyToRemove) =>
    setCanvasBlocks((prev) => prev.filter((b) => b.key !== keyToRemove));

  const moveBlock = (from, to) => {
    setCanvasBlocks((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(from, 1);
      updated.splice(to, 0, moved);
      return updated;
    });
  };

  const fetchBlocks = async () => {
    try {
      const res = await axios.get(fetchUrl);
      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.blocks || res.data?.sections || [];

      const loaded = data.map((section, idx) => ({
        id: `${section.type}-${idx}`,
        type: section.type,
        data: section.data || {},
        key: Date.now() + idx,
        fromPalette: false,
      }));
      setCanvasBlocks(loaded);
    } catch (err) {
      console.error("Failed to load layout:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveBlocks = async () => {
    const payload = canvasBlocks.map((b) => ({ type: b.type, data: b.data || {} }));
    await axios.put(saveUrl, Array.isArray(payload) ? payload : { blocks: payload, sections: payload });
    alert("Layout saved ✅");
  };

  useEffect(() => {
    fetchBlocks();
  }, [fetchUrl]);

  const DraggablePaletteItem = ({ block }) => {
    const [{ isDragging }, dragRef] = useDrag(() => ({
      type: ItemTypes.BLOCK,
      item: () => ({ type: block.type, fromPalette: true }),
      collect: (monitor) => ({ isDragging: monitor.isDragging() })
    }));
    return (
      <div
        ref={dragRef}
        className={`cursor-grab bg-white border p-3 rounded shadow text-xs text-center ${
          isDragging ? "opacity-50" : "opacity-100"
        }`}
      >
        {block.type === "text" ? "📝 Text Block" : <AddSectionTile type={block.type} />}
      </div>
    );
  };

  const ReorderableCanvasBlock = ({ block, index, moveBlock, onDelete, onDropAt, onEdit }) => {
  const ref = useRef(null);
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemTypes.BLOCK,
    canDrop: (item) => item.fromPalette,
    drop: (item, monitor) => {
      if (monitor.didDrop()) return;
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
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop()
    })
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.BLOCK,
    item: { ...block, index, fromPalette: false },
    collect: (monitor) => ({ isDragging: monitor.isDragging() })
  });

  drag(drop(ref));

  return (
  <div
    ref={ref}
    className={`relative group max-w-[1200px] mx-auto bg-white rounded-xl border border-gray-300 mb-6 p-4 shadow-sm transition-all duration-300 ${
      isDragging ? "opacity-40 scale-[0.98] shadow-md" : "hover:shadow-lg"
    } ${isOver && canDrop ? "ring-2 ring-indigo-400 bg-indigo-50" : ""}`}
  >
    {/* Top Bar */}
    <div className="flex justify-between items-start mb-2">
      {/* Left: Type Label + Drag Handle */}
      <div className="flex items-center gap-2">
        <div className="text-gray-400 text-lg cursor-grab select-none">⠿</div>
        <span className="text-sm font-medium text-gray-800 capitalize">
          {block.data?.label || block.type.replace("-", " ")}
        </span>
        {block.type === "layout-section" && (
          <button
            onClick={() => onEdit(block.key, { collapsed: !block.data?.collapsed })}
            className="text-xs text-blue-600 hover:underline"
          >
            {block.data?.collapsed ? "Expand" : "Collapse"}
          </button>
        )}
      </div>

      {/* Right: Edit / Delete */}
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
        <button
          type="button"
          onClick={() => onEdit(block.key)}
          className="text-indigo-600 hover:text-indigo-800 text-xs bg-white border rounded px-2 py-1 shadow-sm"
        >
          ✏️ Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(block.key)}
          className="text-red-500 hover:text-red-700 text-xs bg-white border rounded px-2 py-1 shadow-sm"
        >
          🗑️ Delete
        </button>
      </div>
    </div>

    {/* Block Content */}
    <div className="rounded overflow-hidden border border-dashed">
      {block.data?.collapsed ? (
        <div className="text-xs italic text-gray-400 px-3 py-2">[Collapsed]</div>
      ) : (
        <LiveSectionRenderer
          type={block.type}
          data={block.data}
          blockKey={block.key}
          onDropElement={dropTextIntoColumn}
          onResizeColumn={resizeColumns}
        />
      )}
    </div>
  </div>
);

};


  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex min-h-screen relative">
        {!showSidebar && (
          <button
            className="fixed top-4 right-4 z-[100] p-2 rounded-full shadow bg-gray-800 text-white hover:bg-gray-700"
            onClick={() => setShowSidebar(true)}
          >
            <Settings size={18} />
          </button>
        )}

        <aside className="w-72 h-screen bg-white flex flex-col border-r sticky top-0">
          <div className="flex-1 overflow-y-auto p-4">
            <h2 className="font-semibold text-sm text-gray-700 mb-4">Blocks</h2>
            <div className="space-y-4">
              {paletteTypes.map((type) => (
                <DraggablePaletteItem key={type} block={{ type }} />
              ))}
            </div>
          </div>
          <div className="p-4 border-t bg-white">
            <button
              onClick={saveBlocks}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition"
            >
              Save Layout
            </button>
            {slug && (
  <a
    href={slug === "/" ? "/" : `/pages/${slug}`}
    target="_blank"
    rel="noopener noreferrer"
    className="mt-2 block text-center text-indigo-600 hover:underline text-sm"
  >
    🔍 Preview in New Tab
  </a>
)}

          </div>
        </aside>

        <main className={`flex-1 overflow-auto bg-gray-50 transition-all duration-300 ${showSidebar ? "mr-[320px]" : ""}`}>
          {loading ? (
            <p className="text-gray-500 text-sm text-center py-12">Loading...</p>
          ) : canvasBlocks.length === 0 ? (
            <div className="flex items-center justify-center h-96 border-2 border-dashed rounded-lg m-8 text-gray-400">
              Drag a block here to start building your layout
            </div>
          ) : (
            canvasBlocks.map((block, index) => (
              <ReorderableCanvasBlock
                key={block.key}
                block={block}
                index={index}
                moveBlock={moveBlock}
                onDelete={handleDelete}
                onDropAt={handleDropAt}
                onEdit={handleEditBlock}
              />
            ))
          )}
        </main>

        <aside
          className={`fixed top-0 right-0 h-full w-[320px] bg-white border-l z-50 p-6 shadow-xl transition-transform duration-300 ${
            showSidebar ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
            onClick={() => {
              setShowSidebar(false);
              setEditingBlock(null);
            }}
          >
            ×
          </button>

          {editingBlock ? (
            <>
              <h2 className="text-lg font-semibold mb-4">Edit Block: {editingBlock.type}</h2>
              <SectionSettingsPanel
                block={editingBlock}
                onSave={(data) => handleSaveBlock(editingBlock.key, data)}
                onLiveUpdate={(data) => handleLiveUpdate(editingBlock.key, data)}
                onCancel={() => {
                  setEditingBlock(null);
                  setShowSidebar(false);
                }}
              />
            </>
          ) : (
            <p className="text-sm text-gray-500 mt-20">No block selected.</p>
          )}
        </aside>
      </div>
    </DndProvider>
  );
}
