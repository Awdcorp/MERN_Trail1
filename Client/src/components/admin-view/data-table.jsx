import { useDispatch } from "react-redux";
import {
  bulkUpdateProducts,
  bulkDeleteProducts,
  fetchAllProducts
} from "@/store/admin/products-slice";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ArrowUpDown } from "lucide-react";

export default function DataTable({ columns, data, total = 0, page = 1, onPageChange, filterUI, limit = 10, onLimitChange, search, category, sortBy, sortOrder, onSortChange, allCategories = [], onRowSelectionChange }) {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [selectedRows, setSelectedRows] = useState([]);
  const [editedRows, setEditedRows] = useState({});
  const [isBulkEditing, setIsBulkEditing] = useState(false);

  const allSelected = data.length > 0 && selectedRows.length === data.length;
  const rowsPerPage = limit;
  const totalPages = Math.ceil(total / rowsPerPage);

  const toggleRow = (id) => {
    setSelectedRows((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      onRowSelectionChange?.(updated);
      return updated;
    });
  };

  const toggleAll = () => {
    const updated = allSelected ? [] : data.map((row) => row._id);
    setSelectedRows(updated);
    onRowSelectionChange?.(updated);
  };

  const handleFieldChange = (id, field, value) => {
    if (field === "categories" && Array.isArray(value)) {
      value = value.map((v) => (typeof v === "object" && v._id ? v._id : v));
    }

    setEditedRows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleCategoryCheckbox = (id, categoryId) => {
    const current =
      editedRows?.[id]?.categories ??
      data.find((p) => p._id === id)?.categories?.map((c) => c._id) ??
      [];
    const newCategories = current.includes(categoryId)
      ? current.filter((cid) => cid !== categoryId)
      : [...current, categoryId];

    handleFieldChange(id, "categories", newCategories);
  };

  const handleSaveAll = () => {
    const updates = Object.entries(editedRows).map(([id, updates]) => ({ id, updates }));
    dispatch(bulkUpdateProducts({ updates }))
      .unwrap()
      .then(() => {
        toast({ title: "Changes saved successfully" });
        dispatch(fetchAllProducts({ page, limit, search, category, sortBy, sortOrder }));
        setEditedRows({});
        setSelectedRows([]);
        setIsBulkEditing(false);
      });
  };

  const handleCancelEdit = () => {
    setIsBulkEditing(false);
    setEditedRows({});
  };

  return (
    <div className="flex flex-col h-full px-4 pt-6">
      {selectedRows.length > 0 && (
        <div className="z-20 bg-gray-100 border-t px-4 py-3 text-sm text-gray-800 shadow">
          <div className="flex items-center justify-between">
            <span>✓ {selectedRows.length} selected</span>
            <div className="flex gap-4">
              {!isBulkEditing ? (
                <button className="text-blue-600 hover:underline" onClick={() => setIsBulkEditing(true)}>
                  Bulk Edit
                </button>
              ) : (
                <>
                  <button className="text-green-600 hover:underline" onClick={handleSaveAll}>
                    Save Changes
                  </button>
                  <button className="text-gray-600 hover:underline" onClick={handleCancelEdit}>
                    Cancel
                  </button>
                </>
              )}
              <button
                className="text-red-600 hover:underline"
                onClick={() => {
                  dispatch(bulkDeleteProducts({ ids: selectedRows }))
                    .unwrap()
                    .then(() => {
                      dispatch(fetchAllProducts({ page, limit, search, category, sortBy, sortOrder }));
                      setSelectedRows([]);
                      toast({ title: "Products deleted successfully" });
                    });
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {filterUI && <div className="p-4 border-b bg-muted">{filterUI}</div>}

      <div className="overflow-y-auto">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 bg-white z-10 border-b shadow-sm">
            <tr className="text-muted-foreground">
              <th className="px-4 py-3 text-left">
                <input type="checkbox" checked={allSelected} onChange={toggleAll} />
              </th>
              {columns.map((col) => (
                <th
                  key={col.accessorKey}
                  className={`px-4 py-2 text-left font-medium ${
                    col.sortable ? "cursor-pointer select-none" : ""
                  }`}
                  onClick={() => {
                    if (!col.sortable) return;
                    const newSort =
                      sortBy === col.accessorKey && sortOrder === "asc" ? "desc" : "asc";
                    onSortChange?.({ sortBy: col.accessorKey, sortOrder: newSort });
                  }}
                >
                  <div className="flex items-center gap-1 py-2">
                    {col.header}
                    {col.sortable && (
                      <ArrowUpDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          sortBy === col.accessorKey
                            ? sortOrder === "asc"
                              ? "rotate-180 text-blue-600"
                              : "text-blue-600"
                            : "text-gray-400"
                        }`}
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white">
            {data.map((row, rowIndex) => (
              <tr key={row._id || rowIndex} className="border-b hover:bg-muted transition">
                <td className="px-4 py-6">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(row._id)}
                    onChange={() => toggleRow(row._id)}
                  />
                </td>
                {columns.map((col) => {
                  const value = editedRows?.[row._id]?.[col.accessorKey] ?? row[col.accessorKey];

                  if (!(isBulkEditing && selectedRows.includes(row._id))) {
                    return (
                      <td key={col.accessorKey} className="px-4 py-2">
                        {col.cell ? col.cell(row) : row[col.accessorKey]}
                      </td>
                    );
                  }

                  let editableCell;

                  if (["price", "salePrice", "totalStock"].includes(col.accessorKey)) {
                    editableCell = (
                      <Input
                        type="number"
                        value={value ?? ""}
                        onChange={(e) =>
                          handleFieldChange(row._id, col.accessorKey, parseFloat(e.target.value))
                        }
                      />
                    );
                  } else if (col.accessorKey === "title") {
                    editableCell = (
                      <Input
                        value={value ?? ""}
                        onChange={(e) =>
                          handleFieldChange(row._id, col.accessorKey, e.target.value)
                        }
                      />
                    );
                  } else if (col.accessorKey === "isActive") {
                    editableCell = (
                      <select
                        className="text-sm border px-2 py-1 rounded"
                        value={value === true ? "true" : value === false ? "false" : ""}
                        onChange={(e) =>
                          handleFieldChange(row._id, col.accessorKey, e.target.value === "true")
                        }
                      >
                        <option value="">--</option>
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    );
                  } else if (col.accessorKey === "categories") {
                    const selectedIds = Array.isArray(value)
                      ? value.map((c) => c._id || c)
                      : [];
                    editableCell = (
                      <div className="flex flex-col gap-1 max-h-32 overflow-y-auto">
                        {allCategories.map((cat) => (
                          <label key={cat._id} className="inline-flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(cat._id)}
                              onChange={() => handleCategoryCheckbox(row._id, cat._id)}
                            />
                            {cat.name}
                          </label>
                        ))}
                      </div>
                    );
                  } else {
                    editableCell = col.cell ? col.cell(row) : value;
                  }

                  return <td key={col.accessorKey} className="px-4 py-2">{editableCell}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sticky bottom-0 z-5 bg-white border-t p-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground flex gap-2 items-center">
          <span>Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => onLimitChange?.(parseInt(e.target.value))}
            className="border text-sm px-2 py-1 rounded"
          >
            {[10, 25, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => page > 1 && onPageChange(page - 1)}
                className={page === 1 ? "opacity-50 pointer-events-none" : "cursor-pointer"}
              />
            </PaginationItem>
            <span className="px-4 text-sm">
              Page {page} of {totalPages}
            </span>
            <PaginationItem>
              <PaginationNext
                onClick={() => page < totalPages && onPageChange(page + 1)}
                className={page === totalPages ? "opacity-50 pointer-events-none" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
