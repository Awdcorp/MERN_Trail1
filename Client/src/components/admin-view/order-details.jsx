// imports
import { useState, useEffect } from "react";
import { DialogContent } from "../ui/dialog";
import { useDispatch } from "react-redux";
import {
  getAllOrdersForAdmin,
  updateOrderStatus,
  orderDetailsUpdated,
} from "@/store/admin/order-slice";
import { useToast } from "../ui/use-toast";
import axios from "axios";

const initialFormData = {
  status: "",
  paymentStatus: "",
  paymentMethod: "",
};

const initialAddressForm = {
  customer_name: "",
  address: "",
  city: "",
  pincode: "",
  phone: "",
  notes: "",
};

const ORDER_STATUS_OPTIONS = [
  "inShipping",
  "cancelled",
  "completed",
  "delivered",
  "pending",
  "refunded",
];

const PAYMENT_METHOD_OPTIONS = [
  "Cash on delivery (+AED12)",
  "Card",
  "PayPal",
  "Credit Card (via Paymennt)",
];

const PAYMENT_STATUS_OPTIONS = [
  "paid",
  "pending",
];

function AdminOrderDetailsView({ orderDetails, setOpen }) {
  const [formData, setFormData] = useState(initialFormData);
  const [formAddress, setFormAddress] = useState(initialAddressForm);
  const [formProducts, setFormProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [newProductId, setNewProductId] = useState("");
  const [newProductQty, setNewProductQty] = useState(1);
  const dispatch = useDispatch();
  const { toast } = useToast();

  useEffect(() => {
    if (orderDetails) {
      setFormAddress({
        customer_name: orderDetails.customer_name || "",
        address: orderDetails.addressInfo?.address || "",
        city: orderDetails.addressInfo?.city || "",
        pincode: orderDetails.addressInfo?.pincode || "",
        phone: orderDetails.addressInfo?.phone || "",
        notes: orderDetails.addressInfo?.notes || "",
      });
      setFormProducts(orderDetails.cartItems || []);
    }
  }, [orderDetails]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/admin/products/get`).then((res) => {
      if (res.data?.success) setAllProducts(res.data.data);
    });
  }, []);

  function handleUpdateStatus(event) {
    event.preventDefault();
    const { status, paymentStatus, paymentMethod } = formData;
    dispatch(
      updateOrderStatus({
        id: orderDetails?._id,
        orderStatus: status || orderDetails?.order_status,
        paymentStatus: paymentStatus || orderDetails?.paymentStatus,
        paymentMethod: paymentMethod || orderDetails?.paymentMethod,
        addressInfo: formAddress,
        customer_name: formAddress.customer_name,
        cartItems: formProducts,
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

  function highlightIfChanged(original, selected) {
    return selected && selected !== original ? "border-yellow-400" : "";
  }

  function handleQuantityChange(idx, newQty) {
    setFormProducts((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, quantity: parseInt(newQty) || 1 } : item))
    );
  }

  function handleRemoveItem(idx) {
    setFormProducts((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleAddProduct() {
    const selected = allProducts.find((p) => p._id === newProductId);
    if (!selected) return;
    if (formProducts.some((p) => p.productId === selected._id)) {
      toast({ title: "Product already in list" });
      return;
    }
    const newItem = {
      productId: selected._id,
      title: selected.title,
      price: selected.price,
      quantity: newProductQty,
    };
    setFormProducts((prev) => [...prev, newItem]);
    setNewProductId("");
    setNewProductQty(1);
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

          {/* 🔄 Payment Method */}
          <div className="flex justify-between items-start">
            <span className="text-muted-foreground">Payment Method</span>
            <div className="flex flex-col w-1/2">
              <span className="text-xs text-muted-foreground mb-1">
                Current: {orderDetails?.paymentMethod || "—"}
              </span>
              <select
                className={`border p-1 rounded ${highlightIfChanged(orderDetails?.paymentMethod, formData.paymentMethod)}`}
                value={formData.paymentMethod !== "" ? formData.paymentMethod : orderDetails?.paymentMethod || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, paymentMethod: e.target.value }))
                }
              >
                <option value="">Select Method</option>
                {PAYMENT_METHOD_OPTIONS.map((option, idx) => (
                  <option key={idx} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 🔄 Payment Status */}
          <div className="flex justify-between items-start">
            <span className="text-muted-foreground">Payment Status</span>
            <div className="flex flex-col w-1/2">
              <span className="text-xs text-muted-foreground mb-1">
                Current: {orderDetails?.paymentStatus || "—"}
              </span>
              <select
                className={`border p-1 rounded ${highlightIfChanged(orderDetails?.paymentStatus, formData.paymentStatus)}`}
                value={formData.paymentStatus !== "" ? formData.paymentStatus : orderDetails?.paymentStatus || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, paymentStatus: e.target.value }))
                }
              >
                <option value="">Select Status</option>
                {PAYMENT_STATUS_OPTIONS.map((option, idx) => (
                  <option key={idx} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 🔄 Order Status */}
          <div className="flex justify-between items-start">
            <span className="text-muted-foreground">Order Status</span>
            <div className="flex flex-col w-1/2">
              <span className="text-xs text-muted-foreground mb-1">
                Current: {orderDetails?.order_status || "—"}
              </span>
              <select
                className={`border p-1 rounded ${highlightIfChanged(orderDetails?.order_status, formData.status)}`}
                value={formData.status !== "" ? formData.status : orderDetails?.order_status || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, status: e.target.value }))
                }
              >
                <option value="">Select Status</option>
                {ORDER_STATUS_OPTIONS.map((option, idx) => (
                  <option key={idx} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Editable Shipping Info */}
        <div className="grid gap-2 p-4 border rounded-lg">
          <span className="font-medium text-lg">Shipping Info</span>
          <div className="grid gap-2">
            <input
              placeholder="Customer Name"
              className="border p-2 rounded"
              value={formAddress.customer_name}
              onChange={(e) =>
                setFormAddress((prev) => ({ ...prev, customer_name: e.target.value }))
              }
            />
            <input
              placeholder="Address"
              className="border p-2 rounded"
              value={formAddress.address}
              onChange={(e) => setFormAddress((prev) => ({ ...prev, address: e.target.value }))}
            />
            <input
              placeholder="City"
              className="border p-2 rounded"
              value={formAddress.city}
              onChange={(e) => setFormAddress((prev) => ({ ...prev, city: e.target.value }))}
            />
            <input
              placeholder="Pincode"
              className="border p-2 rounded"
              value={formAddress.pincode}
              onChange={(e) => setFormAddress((prev) => ({ ...prev, pincode: e.target.value }))}
            />
            <input
              placeholder="Phone"
              className="border p-2 rounded"
              value={formAddress.phone}
              onChange={(e) => setFormAddress((prev) => ({ ...prev, phone: e.target.value }))}
            />
            <textarea
              placeholder="Notes"
              className="border p-2 rounded"
              value={formAddress.notes}
              onChange={(e) => setFormAddress((prev) => ({ ...prev, notes: e.target.value }))}
            />
          </div>
        </div>

        {/* Editable Order Items */}
        <div className="grid gap-2 p-4 border rounded-lg">
          <span className="font-medium text-lg">Order Items</span>

          <div className="flex items-center gap-2 mb-2">
            <select
              value={newProductId}
              onChange={(e) => setNewProductId(e.target.value)}
              className="border p-2 rounded text-sm flex-1 max-w-[300px] truncate"
            >
              <option value="">Select product</option>
              {allProducts.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.title} - AED {p.price}
                </option>
              ))}
            </select>
            <input
              type="number"
              min={1}
              value={newProductQty}
              onChange={(e) => setNewProductQty(parseInt(e.target.value))}
              className="w-16 border px-2 py-1 rounded"
            />
            <button
              type="button"
              onClick={handleAddProduct}
              className="bg-black text-white px-3 py-1 rounded"
            >
              Add
            </button>
          </div>

          <ul className="divide-y text-sm">
            {formProducts.length > 0 ? (
              formProducts.map((item, idx) => (
                <li key={idx} className="flex justify-between items-center py-2 gap-2">
                  <div className="flex-1">
                    <span>{item?.productId?.title || item?.title}</span>
                    <div className="text-xs text-muted-foreground">AED {item?.price}</div>
                  </div>
                  <input
                    type="number"
                    min={1}
                    value={item?.quantity}
                    className="w-16 border px-2 py-1 rounded"
                    onChange={(e) => handleQuantityChange(idx, e.target.value)}
                  />
                  <button
                    onClick={() => handleRemoveItem(idx)}
                    className="text-red-500 text-xs ml-2"
                  >
                    Remove
                  </button>
                </li>
              ))
            ) : (
              <li className="text-muted-foreground">No items</li>
            )}
          </ul>
        </div>

        {/* Submit Button */}
        <form onSubmit={handleUpdateStatus} className="grid gap-4">
          <button
            type="submit"
            className="mt-2 bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800"
          >
            Update Order Status
          </button>
        </form>
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;