import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

function AdminProductRow({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
}) {
  return (
    <tr className="border-b hover:bg-muted/40 text-sm">
      {/* ✅ Checkbox */}
      <td className="p-3">
        <input type="checkbox" className="form-checkbox h-4 w-4" />
      </td>

      {/* ✅ Image + Title */}
      <td className="p-3 flex items-center gap-3">
        <img
          src={product?.images?.[0] || product?.image || "/placeholder.png"}
          alt={product?.title}
          className="w-10 h-10 object-cover rounded"
        />
        <span className="font-medium">{product?.title}</span>
      </td>

      {/* ✅ Status */}
      <td className="p-3">
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            product?.isActive
              ? "bg-green-200 text-green-800"
              : "bg-red-200 text-red-800"
          }`}
        >
          {product?.isActive ? "Active" : "Inactive"}
        </span>
      </td>

      {/* ✅ Inventory */}
      <td className="p-3">{product?.totalStock ?? "—"}</td>

      {/* ✅ Category with tooltip */}
      <td className="p-3 max-w-[280px]">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="truncate text-xs text-muted-foreground cursor-default">
              {(product?.categories || []).map((c) => c?.name).join(", ") || "—"}
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-sm bg-white text-black border shadow-lg rounded p-2 text-xs">
            {(product?.categories || []).map((c) => c?.name).join(", ") || "—"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      </td>


      {/* ✅ Brand */}
      <td className="p-3">{product?.brand || "—"}</td>

      {/* ✅ Price / Sale */}
      <td className="p-3">
        <span className={product?.salePrice > 0 ? "line-through" : ""}>
          ${product?.price}
        </span>
        {product?.salePrice > 0 && (
          <span className="ml-1 text-green-600 font-semibold">
            ${product?.salePrice}
          </span>
        )}
      </td>

      {/* ✅ Action Buttons */}
      <td className="p-3 flex gap-2 justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setOpenCreateProductsDialog(true);
            setCurrentEditedId(product?._id);
            setFormData(product);
          }}
        >
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => handleDelete(product?._id)}
        >
          Delete
        </Button>
      </td>
    </tr>
  );
}

export default AdminProductRow;
