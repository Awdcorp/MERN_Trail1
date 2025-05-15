// File: src/pages/admin-view/category.jsx
import { Fragment, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/admin-view/data-table";
import CommonForm from "@/components/common/form";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";

import {
  fetchAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  bulkDeleteCategories,
} from "@/store/admin/category-slice";

const formStructure = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "slug", label: "Slug", type: "text", required: true },
  { name: "description", label: "Description", type: "textarea" },
  { name: "image", label: "Image URL", type: "text" },
];

export default function AdminCategories() {
  const dispatch = useDispatch();
  const { toast } = useToast();  
  const { items: categories, total } = useSelector((state) => state.adminCategories || { items: [], total: 0 });

  // ✅ ADD THIS LOG TO CHECK CATEGORY DATA STRUCTURE
  console.log("📦 Categories from Redux:", categories);

  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [editId, setEditId] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 20;

  useEffect(() => {
    dispatch(fetchAllCategories({ page, limit }));
    console.log("📡 dispatching fetchAllCategories...");
  }, [dispatch, page]);

  const handleFormSubmit = async (data) => {
    try {
      if (editId) {
        await dispatch(updateCategory({ id: editId, data })).unwrap();
        toast({ title: "Category updated" });
      } else {
        await dispatch(addCategory(data)).unwrap();
        toast({ title: "Category created" });
      }
      setFormOpen(false);
      setEditId(null);
      setFormData({});
    } catch (err) {
      toast({ title: err, variant: "destructive" });
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setFormData(item);
    setFormOpen(true);
  };

  const handleDelete = (id) => {
    dispatch(deleteCategory(id));
  };

  const handleBulkDelete = (ids) => {
    dispatch(bulkDeleteCategories(ids));
  };

const columns = useMemo(() => [
  {
    accessorKey: "name",
    header: "Name",
    cell: (row) => row.name ?? "-",
  },
  {
    accessorKey: "slug",
    header: "Slug",
    cell: (row) => row.slug ?? "-",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: (row) => row.description ?? "-",
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: (row) =>
      row.image ? (
        <img src={row.image} alt="category" className="h-8 w-8 object-cover" />
      ) : (
        "-"
      ),
  },
], []);




  return (
  <Fragment>
    <DataTable
      columns={columns}
      data={categories}
      total={total}
      page={page}
      limit={limit}
      getRowId={(row) => row._id}
      onPageChange={setPage}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onBulkDelete={handleBulkDelete}
      filterUI={
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Manage Categories</h1>
          <Button onClick={() => setFormOpen(true)}>Create New</Button>
        </div>
      }
    />

    <Sheet open={formOpen} onOpenChange={setFormOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{editId ? "Edit Category" : "New Category"}</SheetTitle>
        </SheetHeader>
        <CommonForm
          fields={formStructure}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleFormSubmit}
        />
      </SheetContent>
    </Sheet>
  </Fragment>
);
}
