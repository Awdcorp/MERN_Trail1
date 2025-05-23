// Full updated page-builder.jsx with working dropTextIntoColumn integration

import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
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
  "contact-info"
];

const defaultDataMap = {
  "layout-section": {
    layout: "2-column",
    elements: [[], []]
  },
  text: {
    html: "<p>Edit me</p>"
  },
  slider: {},
  "product-slider": { title: "New Arrivals", limit: 8 },
  "category-grid": { title: "Shop by Category", categories: [] },
  "theme-grid": { title: "Themes", themes: [] },
  "contact-info": {
    phones: [],
    whatsapp: [],
    buttonText: "",
    buttonLink: ""
  }
};

export default function PageBuilder() {
  const { id } = useParams();
  const [canvasBlocks, setCanvasBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBlock, setEditingBlock] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);

  const dropTextIntoColumn = (sectionKey, columnIndex, textElement) => {
    setCanvasBlocks((prevBlocks) =>
      prevBlocks.map((section) => {
        if (section.key !== sectionKey) return section;
        const newElements = [...(section.data.elements || [])];
        newElements[columnIndex] = [...(newElements[columnIndex] || []), textElement];
        return {
          ...section,
          data: { ...section.data, elements: newElements }
        };
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

  const handleEditBlock = (blockKey) => {
    const target = canvasBlocks.find((b) => b.key === blockKey);
    if (target) {
      setEditingBlock(target);
      setShowSidebar(true);
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

  const moveBlock = (from, to) =>
    setCanvasBlocks((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(from, 1);
      updated.splice(to, 0, moved);
      return updated;
    });

  const fetchPageBlocks = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/pages/${id}`);
      const loaded =
        res.data?.blocks?.map((section, idx) => ({
          id: `${section.type}-${idx}`,
          type: section.type,
          data: section.data || {},
          key: Date.now() + idx,
          fromPalette: false,
        })) || [];
      setCanvasBlocks(loaded);
    } catch (err) {
      console.error("Failed to load page blocks:", err);
    } finally {
      setLoading(false);
    }
  };

  const savePageBlocks = async () => {
    const payload = canvasBlocks.map((b) => ({ type: b.type, data: b.data || {} }));
    await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/pages/${id}`, { blocks: payload });
    alert("Page layout saved ✅");
  };

  useEffect(() => {
    fetchPageBlocks();
  }, []);

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
        {block.type === "text" ? <span className="text-gray-700">📝 Text Block</span> : <AddSectionTile type={block.type} />}
      </div>
    );
  };

  const ReorderableCanvasBlock = ({ block, index, moveBlock, onDelete, onDropAt, onEdit }) => {
    const ref = useRef(null);
    const [{ isOver, canDrop }, drop] = useDrop({
      accept: ItemTypes.BLOCK,
      canDrop: (item) => item.fromPalette,
      drop: (item, monitor) => {
        if (monitor.didDrop()) return; // ✅ Prevent duplicate drop
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
      collect: (monitor) => ({ isOver: monitor.isOver({ shallow: true }), canDrop: monitor.canDrop() })
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
        className={`relative bg-white border border-gray-200 rounded p-4 shadow-sm transition-shadow ${
          isDragging ? "opacity-50 shadow-lg" : "hover:shadow-md"
        } ${isOver && canDrop ? "border-2 border-indigo-600 bg-indigo-100" : ""}`}
      >
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-sm select-none text-gray-800">{block.type}</span>
          <div className="space-x-2">
            <button onClick={() => onEdit(block.key)} className="text-indigo-600 hover:text-indigo-800 text-sm">✏️ Edit</button>
            <button onClick={() => onDelete(block.key)} className="text-red-500 hover:text-red-700 text-sm">🗑️</button>
          </div>
        </div>
        <LiveSectionRenderer
          type={block.type}
          data={block.data}
          blockKey={block.key}
          onDropElement={dropTextIntoColumn}
        />
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
              onClick={savePageBlocks}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition"
            >
              Save Page Layout
            </button>
          </div>
        </aside>

        <main className={`flex-1 overflow-auto bg-gray-50 transition-all duration-300 ${showSidebar ? "mr-[320px]" : ""}`}>
          {loading ? (
            <p className="text-gray-500 text-sm text-center py-12">Loading...</p>
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
