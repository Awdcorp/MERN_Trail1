import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const productColumns = [
  {
    accessorKey: "title",
    header: "Title",
    cell: (row) => (
      <div className="flex items-center gap-2">
        <img
          src={row.image || row.images?.[0] || "/placeholder.png"}
          className="w-10 h-10 object-cover rounded"
          alt="thumb"
        />
        <span className="font-medium text-sm">{row.title}</span>
      </div>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: (row) => (
      <span
        className={`text-xs px-2 py-1 rounded-full font-medium ${
          row.isActive ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
        }`}
      >
        {row.isActive ? "Active" : "Inactive"}
      </span>
    ),
  },
  {
    accessorKey: "totalStock",
    header: "Stock",
  },
  {
    accessorKey: "categories",
    header: "Category",
    cell: (row) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="truncate text-xs text-muted-foreground cursor-default max-w-[200px]">
              {(row.categories || []).map((c) => c?.name).join(", ") || "—"}
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-sm bg-white text-black border shadow-lg rounded p-2 text-xs">
            {(row.categories || []).map((c) => c?.name).join(", ") || "—"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    accessorKey: "brand",
    header: "Brand",
    cell: (row) => <span className="text-sm text-muted-foreground">{row.brand || "—"}</span>,
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: (row) => (
      <div className="text-sm">
        {row.salePrice > 0 ? (
          <>
            <span className="line-through text-gray-500">₹{row.price}</span>
            <span className="ml-1 text-green-600 font-semibold">₹{row.salePrice}</span>
          </>
        ) : (
          <>₹{row.price}</>
        )}
      </div>
    ),
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: (row) => (
      <div className="flex gap-2 justify-end">
        <Button size="sm" variant="outline" onClick={() => {
  row.setQuickEdit(row._id);
  row.setFormData(row); // ✅ set product data
  row.setOpenCreateProductsDialog(true); // ✅ open the form
}}>
          Quick Edit
        </Button>
        <Button size="sm" onClick={() => row.navigate(`/admin/products/${row._id}`)}>
          Edit
        </Button>
        <Button size="sm" variant="destructive" onClick={() => row.onDelete(row._id)}>
          Delete
        </Button>
      </div>
    ),
  },
];