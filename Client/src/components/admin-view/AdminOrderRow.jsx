import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

function AdminOrderRow({ order, onView }) {
  return (
    <tr className="border-b hover:bg-muted/20 transition-colors">
      <td className="p-3 text-muted-foreground text-sm truncate max-w-[260px]">
        {order?._id || "—"}
      </td>
      <td className="p-3 text-sm text-foreground">
        {typeof order?.orderDate === "string" && order.orderDate.includes("T")
          ? order.orderDate.split("T")[0]
          : "—"}
      </td>
      <td className="p-3">
        <Badge
          className={`py-1 px-3 rounded-full text-xs ${
            order?.orderStatus === "confirmed"
              ? "bg-green-100 text-green-800"
              : order?.orderStatus === "rejected"
              ? "bg-red-100 text-red-800"
              : "bg-muted text-foreground"
          }`}
        >
          {order?.orderStatus || "—"}
        </Badge>
      </td>
      <td className="p-3 text-sm font-medium text-foreground">
        ${order?.totalAmount ?? 0}
      </td>
      <td className="p-3 text-right">
        <Button variant="outline" className="px-4 py-1 text-sm" onClick={onView}>
          View
        </Button>
      </td>
    </tr>
  );
}

export default AdminOrderRow;
