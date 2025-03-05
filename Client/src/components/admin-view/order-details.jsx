import { useState } from "react";
import CommonForm from "../common/form";
import { DialogContent, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useDispatch } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import { useToast } from "../ui/use-toast";

const initialFormData = {
  status: "",
};

function AdminOrderDetailsView({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const dispatch = useDispatch();
  const { toast } = useToast();

  console.log(orderDetails, "orderDetailsorderDetails");

  function handleUpdateStatus(event) {
    event.preventDefault();
    const { status } = formData;

    dispatch(updateOrderStatus({ id: orderDetails?._id, orderStatus: status })).then(
      (data) => {
        if (data?.payload?.success) {
          dispatch(getOrderDetailsForAdmin(orderDetails?._id));
          dispatch(getAllOrdersForAdmin());
          setFormData(initialFormData);
          toast({
            title: data?.payload?.message,
          });
        }
      }
    );
  }

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogTitle>Order Details</DialogTitle>
      {orderDetails && orderDetails._id ? (
        <div className="grid gap-6">
          <div className="grid gap-2">
            <div className="flex mt-6 items-center justify-between">
              <p className="font-medium">Order ID</p>
              <Label>{orderDetails?._id || "N/A"}</Label>
            </div>
            <div className="flex mt-2 items-center justify-between">
              <p className="font-medium">Order Date</p>
              <Label>
                {orderDetails?.order_date
                  ? orderDetails.order_date.split("T")[0]
                  : "No Date"}
              </Label>
            </div>
            <div className="flex mt-2 items-center justify-between">
              <p className="font-medium">Order Price</p>
              <Label>${orderDetails?.total_amount || "0.00"}</Label>
            </div>
            <Separator />
            <div className="grid gap-2">
              <div className="font-medium">Order Items</div>
              <ul className="grid gap-3">
                {orderDetails.items && orderDetails.items.length > 0 ? (
                  orderDetails.items.map((item) => (
                    <li key={item._id} className="flex items-center justify-between">
                      <span>Title: {item.product_name}</span>
                      <span>Quantity: {item.quantity}</span>
                      <span>Price: ${item.price}</span>
                    </li>
                  ))
                ) : (
                  <p>No items found</p>
                )}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center p-4">Loading order details...</p>
      )}
    </DialogContent>
  );
}

export default AdminOrderDetailsView;
