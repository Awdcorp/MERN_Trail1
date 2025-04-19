// imports
import { useState } from "react";
import CommonForm from "../common/form";
import { DialogContent } from "../ui/dialog";
import { Badge } from "../ui/badge";
import { useDispatch } from "react-redux";
import {
  getAllOrdersForAdmin,
  updateOrderStatus,
  orderDetailsUpdated,
} from "@/store/admin/order-slice";
import { useToast } from "../ui/use-toast";

// initial form state
const initialFormData = {
  status: "",
  paymentStatus: "",
  paymentMethod: "",
};

function AdminOrderDetailsView({ orderDetails, setOpen }) {
  const [formData, setFormData] = useState(initialFormData);
  const dispatch = useDispatch();
  const { toast } = useToast();

  // update logic
  function handleUpdateStatus(event) {
    event.preventDefault();
    const { status, paymentStatus, paymentMethod } = formData;

    dispatch(
      updateOrderStatus({
        id: orderDetails?._id,
        orderStatus: status || orderDetails?.order_status,
        paymentStatus: paymentStatus || orderDetails?.paymentStatus,
        paymentMethod: paymentMethod || orderDetails?.paymentMethod,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(orderDetailsUpdated(data.payload.data));
        dispatch(getAllOrdersForAdmin());
        setFormData(initialFormData);
        setOpen(false);
        toast({ title: data?.payload?.message });
      }
    });
  }

  return (
    <DialogContent className="sm:max-w-[600px]">
      <div className="grid gap-6 overflow-y-auto max-h-[90vh]">
        {/* Order Info */}
        <div className="grid gap-2 p-4 border rounded-lg">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Order ID</span>
            <span className="font-medium">{orderDetails?._id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Order Date</span>
            <span className="font-medium">
              {typeof orderDetails?.orderDate === "string" &&
              orderDetails.orderDate.includes("T")
                ? orderDetails.orderDate.split("T")[0]
                : "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Order Price</span>
            <span className="font-medium">
              {orderDetails?.totalAmount
                ? `AED ${orderDetails.totalAmount}`
                : "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Payment Method</span>
            <span className="font-medium">
              {orderDetails?.paymentMethod || "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Payment Status</span>
            <span className="font-medium">
              {orderDetails?.paymentStatus || "—"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Order Status</span>
            <Badge
              className={`py-1 px-3 ${
                orderDetails?.order_status === "confirmed"
                  ? "bg-green-500"
                  : orderDetails?.order_status === "rejected"
                  ? "bg-red-600"
                  : "bg-black"
              }`}
            >
              {orderDetails?.order_status}
            </Badge>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="grid gap-2 p-4 border rounded-lg">
          <span className="font-medium text-lg">Shipping Info</span>
          <div className="text-muted-foreground">
            <div>{orderDetails?.customer_name || "—"}</div>
            <div>{orderDetails?.addressInfo?.address || "—"}</div>
            <div>{orderDetails?.addressInfo?.city || "—"}</div>
            <div>{orderDetails?.addressInfo?.pincode || "—"}</div>
            <div>{orderDetails?.addressInfo?.phone || "—"}</div>
            <div>{orderDetails?.addressInfo?.notes || "—"}</div>
          </div>
        </div>

        {/* ✅ Order Items (Fixed) */}
        <div className="grid gap-2 p-4 border rounded-lg">
          <span className="font-medium text-lg">Order Items</span>
          <ul className="divide-y text-sm">
            {orderDetails?.cartItems && orderDetails.cartItems.length > 0 ? (
              orderDetails.cartItems.map((item, idx) => (
                <li key={idx} className="py-2 flex justify-between">
                  <span>🛒 {item?.title || item?.product_name || "—"}</span>
                  <span>x{item?.quantity ?? 0}</span>
                  <span>{item?.price ?? 0}</span>
                </li>
              ))
            ) : (
              <li className="text-muted-foreground">No items</li>
            )}
          </ul>
        </div>

        {/* Editable Form */}
        <div className="grid gap-2 p-4 border rounded-lg">
          <CommonForm
            formControls={[
              {
                label: "Order Status",
                name: "status",
                componentType: "select",
                options: [
                  { id: "pending", label: "Pending" },
                  { id: "inProcess", label: "In Process" },
                  { id: "inShipping", label: "In Shipping" },
                  { id: "delivered", label: "Delivered" },
                  { id: "rejected", label: "Rejected" },
                ],
              },
              {
                label: "Payment Status",
                name: "paymentStatus",
                componentType: "select",
                options: [
                  { id: "paid", label: "Paid" },
                  { id: "pending", label: "Pending" },
                  { id: "failed", label: "Failed" },
                ],
              },
              {
                label: "Payment Method",
                name: "paymentMethod",
                componentType: "select",
                options: [
                  { id: "Cash on Delivery", label: "Cash on Delivery" },
                  { id: "PayPal", label: "PayPal" },
                  { id: "Card", label: "Card" },
                ],
              },
            ]}
            formData={formData}
            setFormData={setFormData}
            buttonText={"Update Order Status"}
            onSubmit={handleUpdateStatus}
          />
        </div>
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;
