import { useState, useEffect } from "react";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import axios from "axios";

const initialFormData = {
  status: "",
};

function AdminOrderDetailsView({ orderDetails }) {
  const [fetchedOrderDetails, setFetchedOrderDetails] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const { toast } = useToast();

  useEffect(() => {
    if (orderDetails?.id) {
      fetchOrderDetails(orderDetails.id);
    }
  }, [orderDetails]);

  async function fetchOrderDetails(orderId) {
    try {
      const API_URL = `${import.meta.env.VITE_WC_API}/orders/${orderId}`;
      const response = await axios.get(API_URL, {
        auth: {
          username: import.meta.env.VITE_WC_KEY,
          password: import.meta.env.VITE_WC_SECRET,
        },
      });

      console.log("WooCommerce Order Details API Response:", response.data);
      setFetchedOrderDetails(response.data);
      setFormData({ status: response.data.status }); // Set initial status
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast({ title: "Failed to fetch order details", variant: "destructive" });
    }
  }

  async function handleUpdateStatus(event) {
    event.preventDefault();
    const { status } = formData;

    try {
      const API_URL = `${import.meta.env.VITE_WC_API}/orders/${fetchedOrderDetails.id}`;
      await axios.put(
        API_URL,
        { status },
        {
          auth: {
            username: import.meta.env.VITE_WC_KEY,
            password: import.meta.env.VITE_WC_SECRET,
          },
        }
      );

      toast({ title: `Order status updated to "${status}"` });
      fetchOrderDetails(fetchedOrderDetails.id); // Refresh details after update
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({ title: "Failed to update order status", variant: "destructive" });
    }
  }

  if (!fetchedOrderDetails) {
    return (
      <DialogContent className="sm:max-w-[600px]">
        <p>Loading order details...</p>
      </DialogContent>
    );
  }

  const {
    id,
    date_created,
    status,
    total,
    currency,
    billing,
    shipping,
    payment_method_title,
    transaction_id,
    line_items,
  } = fetchedOrderDetails;

  return (
    <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
      <div className="grid gap-6">
        {/* Order Details */}
        <div className="grid gap-2">
          <div className="flex mt-6 items-center justify-between">
            <p className="font-medium">Order ID</p>
            <Label>{id}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Date</p>
            <Label>{new Date(date_created).toLocaleDateString()}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Total Price</p>
            <Label>{currency} {total}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Status</p>
            <Badge>{status}</Badge>
          </div>
          <Separator />
        </div>

        {/* Order Status Update Form */}
        <form onSubmit={handleUpdateStatus} className="space-y-4">
          <h3 className="text-lg font-semibold">Update Order Status</h3>
          <select
            className="w-full border p-2 rounded"
            value={formData.status}
            onChange={(e) => setFormData({ status: e.target.value })}
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <Button 
            type="submit" 
            className="bg-primary text-white font-medium py-2 px-4 rounded hover:bg-primary-dark transition duration-200"
          >
            Update Status
          </Button>
          <Separator />
        </form>

        {/* Customer Information */}
        <div className="grid gap-2">
          <h3 className="text-lg font-semibold">Customer Details</h3>
          <p className="font-medium">Billing Address</p>
          <Label>
            {billing.first_name} {billing.last_name}, {billing.address_1}, {billing.address_2}, {billing.city}, {billing.country}
          </Label>
          <p className="font-medium mt-2">Shipping Address</p>
          <Label>
            {shipping.first_name} {shipping.last_name}, {shipping.address_1}, {shipping.address_2}, {shipping.city}, {shipping.country}
          </Label>
          <Separator />
        </div>

        {/* Payment Information */}
        <div className="grid gap-2">
          <h3 className="text-lg font-semibold">Payment Information</h3>
          <div className="flex items-center justify-between">
            <p className="font-medium">Payment Method</p>
            <Label>{payment_method_title}</Label>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-medium">Transaction ID</p>
            <Label>{transaction_id || "N/A"}</Label>
          </div>
          <Separator />
        </div>

        {/* Order Items */}
        <div className="grid gap-2">
          <h3 className="text-lg font-semibold">Order Items</h3>
          {line_items && line_items.length > 0 ? (
            <div className="border p-2 rounded-md">
              {line_items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-none">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">{currency} {item.total}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No items in this order</p>
          )}
        </div>
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;
