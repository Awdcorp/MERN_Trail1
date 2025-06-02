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
    const [showPreview, setShowPreview] = useState(false);
    const [previewMode, setPreviewMode] = useState("desktop"); // or 'mobile'

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
  const payload = {
    sections: canvasBlocks.map((b) => ({
      type: b.type,
      data: b.data || {},
    })),
  };

  console.log("💾 Saving to:", saveUrl);
  console.log("📦 Payload:", payload);

  try {
    await axios.put(saveUrl, payload); // ✅ your backend expects PUT
    alert("Layout saved ✅");
  } catch (err) {
    console.error("❌ Save failed:", err);
    alert("Failed to save layout ❌");
  }
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
                className={`cursor-grab bg-white border p-3 rounded shadow text-xs text-center ${isDragging ? "opacity-50" : "opacity-100"
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
  className={`relative group border-2 border-transparent bg-white overflow-visible shadow-sm transition-all duration-200
    ${isDragging ? "opacity-40 scale-[0.98]" : ""}
    ${isOver && canDrop ? "ring-2 ring-indigo-400 bg-indigo-50" : ""}
  `}
>
  <div className="group-hover:ring-2 group-hover:ring-indigo-500">
    {/* Floating Toolbar */}
    <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3 bg-[#393E46] rounded-b-xl shadow px-3 py-1 opacity-0 group-hover:opacity-100 transition z-10">
  {/* Drag Icon */}
  <span className="text-white cursor-move select-none">
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 10h16M4 14h16" />
    </svg>
  </span>

  {/* Edit Button */}
  <button
    onClick={() => onEdit(block.key)}
    className="text-white hover:text-indigo-300 transition"
    title="Edit Block"
  >
    <svg
  xmlns="http://www.w3.org/2000/svg"
  className="w-4 h-4"
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
  strokeWidth={2}
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z"
  />
</svg>
  </button>

  {/* Delete Button */}
  <button
    onClick={() => onDelete(block.key)}
    className="text-white hover:text-red-300 transition"
    title="Delete Block"
  >
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
</div>


    {/* Block Content */}
    <div className="overflow-hidden">
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
</div>

        );

    };
const EmptyDropZone = ({ onDropAt }) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemTypes.BLOCK,
    canDrop: (item) => item.fromPalette,
    drop: (item) => {
      onDropAt(item, 0); // Insert at the start
      item.fromPalette = false;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`flex items-center justify-center h-96 border-2 border-dashed rounded-lg m-8 transition 
        ${isOver && canDrop ? "border-indigo-400 bg-indigo-50" : "border-gray-400 text-gray-400"}`}
    >
      Drag a block here to start building your layout
    </div>
  );
};


    return (
        <DndProvider backend={HTML5Backend}>
            <div className="flex min-h-screen relative">

                <aside className="w-72 h-screen bg-[#393E46] flex flex-col sticky top-0">
                    <div className="flex-1 overflow-y-auto p-4 scrollbar-hidden">
                        <h2 className="font-semibold text-sm text-white mb-4">Blocks</h2>
                        <div className="space-y-4 pr-2">
                            {paletteTypes.map((type) => (
                                <DraggablePaletteItem key={type} block={{ type }} />
                            ))}
                        </div>
                    </div>
                    <div className="p-4 bg-[#393E46]">
  <div className="flex gap-2 justify-between">
    <button
      onClick={() => setShowPreview(true)}
      className="flex items-center justify-center gap-2 w-1/2 bg-white text-gray-800 px-4 py-2 rounded-md shadow hover:bg-gray-100 transition text-sm font-medium"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
      Preview
    </button>

    <button
      onClick={saveBlocks}
      className="flex items-center justify-center gap-2 w-1/2 bg-indigo-600 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-700 transition text-sm font-medium"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path d="M5 13l4 4L19 7" />
      </svg>
      Save
    </button>
  </div>

  {slug && (
  <button
    onClick={() => window.open(slug === "/" ? "/" : `/pages/${slug}`, "_blank")}
    className="mt-2 w-full flex items-center justify-center gap-2 bg-white text-gray-800 px-4 py-2 rounded-md shadow hover:bg-gray-100 transition text-xs font-medium"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 10l4.553-4.553A2 2 0 0017.553 3H13a2 2 0 00-2 2v2M9 14l-4.553 4.553A2 2 0 006.447 21H11a2 2 0 002-2v-2"
      />
    </svg>
    Preview in New Tab
  </button>
)}

</div>

                </aside>

                <main className="flex-1 overflow-auto bg-[#393E46] pt-4 transition-all duration-300">

                    {loading ? (
                        <p className="text-gray-500 text-sm text-center py-12">Loading...</p>
                    ) : canvasBlocks.length === 0 ? (
  <EmptyDropZone onDropAt={handleDropAt} />
)
 : (
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

                <aside className="fixed top-0 right-0 h-full w-[320px] bg-white border-l z-50 p-6 shadow-xl">
  {editingBlock ? (
    <>
      <h2 className="text-lg font-semibold mb-4">Edit Block: {editingBlock.type}</h2>
      <SectionSettingsPanel
        block={editingBlock}
        onSave={(data) => handleSaveBlock(editingBlock.key, data)}
        onLiveUpdate={(data) => handleLiveUpdate(editingBlock.key, data)}
        onCancel={() => {
          setEditingBlock(null);
        }}
      />
    </>
  ) : (
    <p className="text-sm text-gray-500 mt-20">No block selected.</p>
  )}
</aside>

            </div>
            {showPreview && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
                    <div className="bg-white w-[90vw] h-[90vh] rounded-xl shadow-xl overflow-hidden relative flex flex-col">
                        {/* Header */}
                        <div className="flex justify-between items-center px-4 py-2 border-b bg-gray-100">
                            <div className="text-lg font-semibold">Live Preview</div>
                            <div className="space-x-2">
                                <button
                                    onClick={() => setPreviewMode("desktop")}
                                    className={`px-3 py-1 rounded text-sm ${previewMode === "desktop" ? "bg-indigo-600 text-white" : "bg-white border"}`}
                                >
                                    Desktop
                                </button>
                                <button
                                    onClick={() => setPreviewMode("mobile")}
                                    className={`px-3 py-1 rounded text-sm ${previewMode === "mobile" ? "bg-indigo-600 text-white" : "bg-white border"}`}
                                >
                                    Mobile
                                </button>
                            </div>
                            <button
                                onClick={() => setShowPreview(false)}
                                className="text-gray-500 hover:text-black text-xl"
                            >
                                ×
                            </button>
                        </div>
                        {/* live preview neew to improve later */}
                        <div className="flex-1 flex justify-center items-start overflow-auto bg-gray-100 p-4">
                            <iframe
                                title="Live Preview"
                                src={`/`}
                                className={`border-none rounded shadow ${previewMode === "mobile" ? "w-[375px] h-[667px]" : "w-full h-[calc(90vh-3rem)]"}`}
                            />
                        </div>
                    </div>
                </div>
            )}

        </DndProvider>
    );
}
