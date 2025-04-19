import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

// ✅ Helper functions for status badge styling
const getOrderStatusClasses = (status) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-700";
    case "pending":
      return "bg-blue-100 text-blue-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    case "refunded":
      return "bg-yellow-100 text-yellow-800";
    case "confirmed":
      return "bg-green-200 text-green-800";
    default:
      return "bg-muted text-foreground";
  }
};

const getPaymentStatusClasses = (status) => {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-700";
    case "pending":
      return "bg-gray-100 text-gray-700";
    case "refunded":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-muted text-foreground";
  }
};

function AdminOrderRow({ order, onView }) {

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
          className={`text-xs font-normal px-2 py-1 rounded-full ${getOrderStatusClasses(order?.order_status)}`}
        >
          {order?.order_status || "—"}
        </Badge>
      </td>

      <td className="p-3">
        {order?.paymentMethod || "—"}
      </td>

      <td className="p-3">
        <Badge
          className={`text-xs font-normal px-2 py-1 rounded-full ${getPaymentStatusClasses(order?.paymentStatus)}`}
        >
          {order?.paymentStatus || "—"}
        </Badge>
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
      <Button
  variant="outline"
  className="px-4 py-1 text-sm"
  onClick={() => {
    console.log("🧾 Viewing order:", order);
    onView();
  }}
>
  View
</Button>
      </td>
    </tr>
  );
}

export default AdminOrderRow;
