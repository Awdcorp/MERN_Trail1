// src/pages/admin-view/homepage.jsx — drag overlay fully fixed
import { useEffect, useState } from "react";
import axios from "axios";
import ReactDOM from "react-dom";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  DragOverlay,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Button } from "@/components/ui/button";
import SectionPreview from "@/components/admin-view/section-preview";
import AddSectionTile from "@/components/admin-view/add-section-tile";




export default function AdminHomepage() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draggingSection, setDraggingSection] = useState(null);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/homepage-layout`);
        setSections(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch homepage layout", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSections();
  }, []);

  useEffect(() => {
    if (draggingSection) {
      document.body.classList.add("dragging");
    } else {
      document.body.classList.remove("dragging");
    }
  }, [draggingSection]);

  const saveLayout = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/homepage-layout`, { sections });
      alert("✅ Layout saved.");
    } catch (err) {
      console.error("❌ Failed to save layout", err);
      alert("❌ Failed to save layout");
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    if (active?.data?.current?.fromPalette) {
      setDraggingSection(active.data.current.section);
    } else {
      const index = sections.findIndex((_, i) => `section-${i}` === active.id);
      setDraggingSection(sections[index]);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setDraggingSection(null);

    if (!over || !over.id) {
      if (active.data.current?.fromPalette) {
        setSections([...sections, active.data.current.section]);
      }
      return;
    }

    const overId = over.id;
    const overIndex = sections.findIndex((_, i) => `section-${i}` === overId);
    const activeIndex = sections.findIndex((_, i) => `section-${i}` === active.id);

    if (overId === "layout-canvas" && active.data.current?.fromPalette) {
      setSections([...sections, active.data.current.section]);
      return;
    }

    if (active.data.current?.fromPalette) {
      const newSections = [...sections];
      const insertIndex = overIndex === -1 ? sections.length : overIndex;
      newSections.splice(insertIndex, 0, active.data.current.section);
      setSections(newSections);
    } else if (activeIndex !== overIndex && activeIndex > -1 && overIndex > -1) {
      setSections((items) => arrayMove(items, activeIndex, overIndex));
    }
  };

  const SortableSection = ({ id, index, type }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="border rounded-md p-4 mb-2 bg-white"
      >
        <div className="flex justify-between items-center mb-2">
          <strong>{type}</strong>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              const copy = [...sections];
              copy.splice(index, 1);
              setSections(copy);
            }}
          >
            🗑️ Delete
          </Button>
        </div>
        <SectionPreview type={type} />
      </div>
    );
  };

  const { setNodeRef: dropRef } = useDroppable({ id: "layout-canvas" });

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-[calc(100vh-60px)]">
        {/* Sidebar */}
        <aside className="w-[260px] bg-gray-100 p-4 border-r overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Available Sections</h3>
          <div className="space-y-4">
            {["slider", "product-slider", "category-grid", "theme-grid", "party-packages", "store-locations", "contact-info"].map(
              (type) => (
                <div key={type} title={`Drag this ${type.replace("-", " ")} into the layout`}>
                  <AddSectionTile type={type} />
                </div>
              )
            )}
          </div>
        </aside>

        {/* Main Canvas */}
        <main className="flex-1 overflow-y-auto p-6 bg-white">
          <h2 className="text-2xl font-bold mb-2">Homepage Layout</h2>
          <p className="text-gray-600 text-sm mb-6">
            🧭 Drag a section from the sidebar and drop it below to build your homepage.
          </p>

          <div
            ref={dropRef}
            id="layout-canvas"
            className="min-h-[300px] border-2 border-dashed border-blue-300 p-6 rounded-md bg-blue-50"
          >
            <SortableContext items={sections.map((_, i) => `section-${i}`)} strategy={verticalListSortingStrategy}>
              {sections.length === 0 && (
                <div className="text-gray-400 text-sm mb-4 text-center">
                  Drop sections here to build your homepage layout.
                </div>
              )}
              {sections.map((section, index) => (
                <SortableSection
                  key={`section-${index}`}
                  id={`section-${index}`}
                  index={index}
                  type={section.type}
                />
              ))}
            </SortableContext>
          </div>

          <div className="pt-6">
            <Button onClick={saveLayout}>💾 Save Layout</Button>
          </div>
        </main>

        {ReactDOM.createPortal(
          <DragOverlay adjustScale={false}>
  {draggingSection && (
    <div className="opacity-80">
      <SectionPreview type={draggingSection.type} />
    </div>
  )}
</DragOverlay>,

          document.body
        )}
      </div>
    </DndContext>
  );
}
