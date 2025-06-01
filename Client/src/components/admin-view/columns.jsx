import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const productColumns = [
  {
  accessorKey: "title",
  header: "Title",
  cell: (row) => {
    const createdDate = row.createdAt
      ? new Date(row.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : null;

    return (
      <div className="flex items-start gap-2">
        <img
          src={row.image || row.images?.[0] || "/placeholder.png"}
          className="w-10 h-10 object-cover rounded"
          alt="thumb"
        />
        <div className="flex flex-col">
          <span className="font-medium text-sm">{row.title}</span>
          {createdDate && (
            <span className="text-xs text-muted-foreground">{createdDate}</span>
          )}
        </div>
      </div>
    );
  },
},

  {
  accessorKey: "status",
  header: "Status",
  cell: (row) => {
    const status = row.status || "draft";
    const statusStyles = {
      published: "bg-green-200 text-green-800",
      draft: "bg-yellow-200 text-yellow-800",
      archived: "bg-gray-200 text-gray-700",
    };

    return (
      <span
        className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyles[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  },
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