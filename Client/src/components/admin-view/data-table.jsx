import { useDispatch } from "react-redux";
import {
  bulkUpdateProducts,
  bulkDeleteProducts,
  fetchAllProducts
} from "@/store/admin/products-slice";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";
import { ArrowUpDown } from "lucide-react";

export default function DataTable({ columns, data, total = 0, page = 1, onPageChange, filterUI, limit, search, category, sortBy, sortOrder }) {
  const rowsPerPage = 10;
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [selectedRows, setSelectedRows] = useState([]);
  const allSelected = data.length > 0 && selectedRows.length === data.length;

  const toggleRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (allSelected) {
      setSelectedRows([]);
    } else {
      setSelectedRows(data.map((row) => row._id));
    }
  };

  const sortedData = sortBy
    ? [...data].sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];
        if (typeof aVal === "string") {
          return sortOrder === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      })
    : data;

  const totalPages = Math.ceil(total / rowsPerPage);

  return (
    <div className="border rounded-md">
      {selectedRows.length > 0 && (
        <div className="z-20 bg-gray-100 border-t px-4 py-3 text-sm text-gray-800 shadow">
          <div className="flex items-center justify-between">
            <span>✓ {selectedRows.length} selected</span>
            <div className="flex gap-4">
              <button
                className="text-blue-600 hover:underline"
                onClick={() => {
                  dispatch(bulkUpdateProducts({ ids: selectedRows, updates: { isActive: true } }))
                    .unwrap()
                    .then(() => {
                      dispatch(fetchAllProducts({ page, limit, search, category, sortBy, sortOrder }));
                      setSelectedRows([]);
                      toast({ title: "Products activated successfully" });
                    });
                }}
              >
                Activate
              </button>

              <button
                className="text-gray-600 hover:underline"
                onClick={() => {
                  dispatch(bulkUpdateProducts({ ids: selectedRows, updates: { isActive: false } }))
                    .unwrap()
                    .then(() => {
                      dispatch(fetchAllProducts({ page, limit, search, category, sortBy, sortOrder }));
                      setSelectedRows([]);
                      toast({ title: "Products deactivated successfully" });
                    });
                }}
              >
                Deactivate
              </button>

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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <input type="checkbox" checked={allSelected} onChange={toggleAll} />
            </TableHead>
            {columns.map((col) => (
              <TableHead
                key={col.accessorKey}
                className={col.sortable ? "cursor-pointer select-none" : ""}
              >
                <div className="flex items-center gap-1">
                  {col.header}
                  {col.sortable && <ArrowUpDown className="w-4 h-4" />}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((row, rowIndex) => (
            <TableRow key={row._id || rowIndex}>
              <TableCell>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(row._id)}
                  onChange={() => toggleRow(row._id)}
                />
              </TableCell>
              {columns.map((col) => (
                <TableCell key={col.accessorKey}>
                  {col.cell ? col.cell(row) : row[col.accessorKey]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="sticky bottom-0 z-10 bg-white border-t p-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Rows per page: {rowsPerPage}
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
