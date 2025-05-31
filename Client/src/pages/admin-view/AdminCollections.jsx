// File: Client/src/pages/admin-view/AdminCollections.jsx

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/admin-view/data-table";
import CommonForm from "@/components/common/form";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import MediaPicker from "@/components/admin-view/MediaPicker";
import ProductSearchSelector from "@/components/admin-view/ProductSearchSelector";
import CategoryMultiSelector from "@/components/admin-view/CategoryMultiSelector";

export default function AdminCollections() {
  const { toast } = useToast();

  const [collections, setCollections] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({ type: "product" });
  const [editId, setEditId] = useState(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/admin/collections`)
      .then((res) => {
        setCollections(res.data.data || []);
      });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const data = { ...formData };
    const method = editId ? "put" : "post";
    const url = editId ? `/api/admin/collections/${editId}` : "/api/admin/collections";

    axios[method](`${import.meta.env.VITE_API_URL}${url}`, data)
      .then(() => {
        toast({ title: editId ? "Collection updated" : "Collection created" });
        fetchCollections();
        setFormOpen(false);
        setEditId(null);
        setFormData({ type: "product" });
      })
      .catch((err) => {
        toast({ title: "Error saving collection", variant: "destructive" });
        console.error(err);
      });
  };

  const handleEdit = (row) => {
    setEditId(row._id);
    setFormData(row);
    setFormOpen(true);
  };

  const handleDelete = (id) => {
    axios
      .delete(`${import.meta.env.VITE_API_URL}/api/admin/collections/${id}`)
      .then(() => {
        toast({ title: "Collection deleted" });
        fetchCollections();
      });
  };

  const columns = useMemo(
    () => [
      { accessorKey: "name", header: "Name", cell: (row) => row.name },
      { accessorKey: "type", header: "Type", cell: (row) => row.type },
      {
        accessorKey: "image",
        header: "Image",
        cell: (row) =>
          row.image ? <img src={row.image} className="h-8 w-8 object-cover" /> : "-",
      },
      {
        header: "Actions",
        cell: (row) => (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleEdit(row)}>
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(row._id)}
            >
              Delete
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const formStructure = [
    { name: "name", label: "Name", type: "text", required: true },
    {
      name: "type",
      label: "Collection Type",
      componentType: "select",
      options: [
        { id: "product", label: "Product" },
        { id: "category", label: "Category" },
      ],
    },
    {
      name: "image",
      label: "Image",
      type: "custom",
      render: ({ value }) => (
        <div className="mb-4">
          {value && (
            <img
              src={value}
              alt=""
              className="w-20 h-20 object-cover rounded border mb-2"
            />
          )}
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowMediaPicker(true)}
          >
            Choose Image
          </Button>
        </div>
      ),
    },
    {
      name: "items",
      label: "Items",
      type: "custom",
      render: () =>
        formData.type === "product" ? (
          <ProductSearchSelector
            value={formData.items || []}
            onChange={(items) => setFormData((prev) => ({ ...prev, items }))}
          />
        ) : (
          <CategoryMultiSelector
            value={formData.items || []}
            onChange={(items) => setFormData((prev) => ({ ...prev, items }))}
          />
        ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Manage Collections</h1>
        <Button onClick={() => setFormOpen(true)}>Create New</Button>
      </div>

      <DataTable
        columns={columns}
        data={collections}
        getRowId={(row) => row._id}
        onEdit={handleEdit}
        onDelete={(row) => handleDelete(row._id)}
      />

      <Sheet open={formOpen} onOpenChange={setFormOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{editId ? "Edit Collection" : "New Collection"}</SheetTitle>
          </SheetHeader>
          <CommonForm
            formControls={formStructure}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleFormSubmit}
          />
        </SheetContent>
      </Sheet>

      <MediaPicker
        open={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        onSelect={(url) => {
          setFormData((prev) => ({ ...prev, image: url }));
          setShowMediaPicker(false);
        }}
      />
    </div>
  );
}
