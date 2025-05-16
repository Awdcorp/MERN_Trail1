// File: src/pages/admin-view/category.jsx
import { Fragment, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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

export default function AdminCategories() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { items: categories, total } = useSelector((state) => state.adminCategories || { items: [], total: 0 });

  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [editId, setEditId] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [allCategories, setAllCategories] = useState([]);

  useEffect(() => {
    dispatch(fetchAllCategories({ page, limit }));

    fetch(`${import.meta.env.VITE_API_URL}/api/categories`)
      .then((res) => res.json())
      .then((data) => setAllCategories(data));

    console.log("📡 dispatching fetchAllCategories...");
  }, [dispatch, page, limit]);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    console.log("📝 Submitted Form Data:", formData);
    console.log("✏️ Current Edit ID:", editId);

    const data = formData;

    if (editId) {
      dispatch(updateCategory({ id: editId, data }))
        .unwrap()
        .then(() => {
          toast({ title: "Category updated" });
          dispatch(fetchAllCategories({ page, limit }));
        })
        .catch((err) => toast({ title: err, variant: "destructive" }));
    } else {
      dispatch(addCategory(data))
        .unwrap()
        .then(() => {
          toast({ title: "Category created" });
          dispatch(fetchAllCategories({ page, limit }));
        })
        .catch((err) => toast({ title: err, variant: "destructive" }));
    }

    setFormOpen(false);
    setEditId(null);
    setFormData({});
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setFormData({
      ...item,
      parent: item.parent?._id || item.parent || "",
    });
    setFormOpen(true);
  };

  const handleDelete = (id) => {
    dispatch(deleteCategory(id));
  };

  const handleBulkDelete = (ids) => {
    dispatch(bulkDeleteCategories(ids));
  };

  const columns = useMemo(
    () => [
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
        header: "Parent",
        cell: (row) => row.parent?.name ?? "-",
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
      {
        header: "Actions",
        cell: (row) => (
          <div className="flex gap-3">
            <button className="text-blue-600 hover:underline" onClick={() => handleEdit(row)}>
              Edit
            </button>
            <button className="text-red-600 hover:underline" onClick={() => handleDelete(row._id)}>
              Delete
            </button>
          </div>
        ),
      },
    ],
    [handleEdit, handleDelete]
  );

  const formStructure = [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "slug", label: "Slug", type: "text", required: true },
    { name: "description", label: "Description", type: "textarea" },
    { name: "image", label: "Image URL", type: "text" },
    {
      name: "parent",
      label: "Parent Category",
      componentType: "select",
      options: allCategories.map((cat) => ({ id: cat._id, label: cat.name })),
    },
  ];

  return (
    <Fragment>
      <DataTable
        columns={columns}
        data={categories}
        total={total}
        page={page}
        limit={limit}
        onLimitChange={(val) => {
          setLimit(val);
          setPage(1);
        }}
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
            formControls={formStructure}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleFormSubmit}
          />
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}
