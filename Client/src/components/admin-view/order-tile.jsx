import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

function AdminOrderRow({ order, onView }) {
  console.log("🧾 AdminOrderRow order:", order); // ✅ Log incoming order

  return (
    <tr className="border-b hover:bg-muted/20 transition-colors">
      <td className="p-3 text-sm text-foreground font-medium truncate max-w-[260px]">
        {order?.wc_order_id ? `#${order.wc_order_id}` : order?._id || "—"}
      </td>

      <td className="p-3 text-sm text-foreground">
        {order?.customer_name || "—"}
      </td>

      <td className="p-3 text-sm text-foreground">
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

      <td className="p-3">

        {order?.paymentMethod || "—"}
      </td>

      <td className="p-3 text-sm text-foreground">
        
        {order?.totalAmount ? `AED ${order.totalAmount}` : "—"}
      </td>

      <td className="p-3">

        {typeof order?.orderDate === "string" && order.orderDate.includes("T")
          ? order.orderDate.split("T")[0]
          : "—"}
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
