import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

function AdminOrderRow({ order, onView }) {
  console.log("🧾 AdminOrderRow order:", order); // ✅ Log incoming order

  return (
    <tr className="border-b hover:bg-muted/20 transition-colors">
      <td className="p-3 text-sm text-foreground font-medium truncate max-w-[260px]">
        {order?._id || "—"}
      </td>

      {/* ✅ Order Date Fix */}
      <td className="p-3 text-sm text-foreground">
        {typeof order?.order_date === "string" && order.order_date.includes("T")
          ? order.order_date.split("T")[0]
          : "—"}
      </td>

      {/* ✅ Order Status Fix */}
      <td className="p-3">
        <Badge
          className={`text-xs font-normal px-2 py-1 rounded-full  ${
            order?.order_status === "confirmed"
              ? "bg-green-200 text-green-800"
              : order?.order_status === "cancelled"
              ? "bg-red-200 text-red-800"
              : "bg-muted text-foreground"
          }`}
        >
          {order?.order_status || "—"}
        </Badge>
      </td>

      {/* ✅ Total Amount Fix */}
      <td className="p-3">
        {order?.total_amount || "$0"}
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
