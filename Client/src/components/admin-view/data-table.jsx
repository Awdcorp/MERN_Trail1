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

export default function DataTable({ columns, data, total = 0, page = 1, onPageChange, filterUI }) {
  const rowsPerPage = 10;

  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const handleSort = (accessorKey) => {
    if (sortBy === accessorKey) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(accessorKey);
      setSortOrder("asc");
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
      {filterUI && <div className="p-4 border-b bg-muted">{filterUI}</div>}
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={col.accessorKey}
                onClick={() => col.sortable && handleSort(col.accessorKey)}
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