// imports
import { useState, useEffect } from "react";
import { DialogContent } from "../ui/dialog";
import { useDispatch } from "react-redux";
import {
  getAllOrdersForAdmin,
  updateOrderStatus,
  orderDetailsUpdated,
  initiateRefund,
  createOrder,
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

const PAYMENT_STATUS_OPTIONS = ["paid", "pending"];

function AdminOrderDetailsView({ orderDetails, setOpen, isNewOrder }) {
  const [formData, setFormData] = useState(initialFormData);
  const [formAddress, setFormAddress] = useState(initialAddressForm);
  const [formProducts, setFormProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [newProductQty, setNewProductQty] = useState(1);
  const [refundAmount, setRefundAmount] = useState(0);
  const [refundReason, setRefundReason] = useState("");
  const [restockItems, setRestockItems] = useState(true);

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
      setRefundAmount(orderDetails.totalAmount || 0);
    }
  }, [orderDetails]);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchQuery.length > 1) {
        axios
          .get(`${import.meta.env.VITE_API_URL}/api/products/search?query=${searchQuery}`)
          .then((res) => {
            if (res.data?.success) setSearchResults(res.data.data);
          });
      } else {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [searchQuery]);

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

  function handleAddProduct(product) {
    if (formProducts.some((item) => item.productId === product._id)) {
      toast({ title: "Product already in list" });
      return;
    }
    setFormProducts((prev) => [
      ...prev,
      {
        productId: product._id,
        title: product.title,
        price: product.price,
        quantity: newProductQty,
      },
    ]);
    setSearchQuery("");
    setNewProductQty(1);
    setSearchResults([]);
  }

  function handleRefundSubmit() {
    if (!refundAmount || refundAmount <= 0) {
      toast({ title: "Invalid refund amount" });
      return;
    }
    dispatch(
      initiateRefund({
        orderId: orderDetails._id,
        refundAmount,
        refundReason,
        restockItems,
      })
    ).then((res) => {
      if (res?.payload?.success) {
        toast({ title: "Refund processed" });
        dispatch(getAllOrdersForAdmin());
        setOpen(false);
      } else {
        toast({ title: "Refund failed" });
      }
    });
  }

  function handleSubmit() {
    const { status, paymentStatus, paymentMethod } = formData;
    const payload = {
      orderStatus: status,
      paymentStatus,
      paymentMethod,
      addressInfo: formAddress,
      customer_name: formAddress.customer_name,
      cartItems: formProducts,
    };

    if (isNewOrder) {
      dispatch(createOrder(payload)).then((res) => {
        if (res?.payload?.success) {
          toast({ title: "Order created" });
          dispatch(getAllOrdersForAdmin());
          setOpen(false);
        }
      });
    } else {
      dispatch(
        updateOrderStatus({
          id: orderDetails?._id,
          ...payload,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(orderDetailsUpdated(data.payload.data));
          dispatch(getAllOrdersForAdmin());
          setOpen(false);
          toast({ title: data?.payload?.message });
        }
      });
    }
  }

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto px-6 py-8 md:px-12 md:py-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Order Details</h2>
        <button onClick={() => setOpen(false)} className="text-xl">×</button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="space-y-2 md:col-span-1">
          {!isNewOrder && (
            <>
              <label className="text-sm font-medium">Order ID</label>
              <div className="text-sm text-gray-700">{orderDetails?._id}</div>
              <label className="text-sm font-medium mt-2">Order Date</label>
              <div className="text-sm text-gray-700">
                {typeof orderDetails?.orderDate === "string" && orderDetails.orderDate.includes("T")
                  ? orderDetails.orderDate.split("T")[0]
                  : "—"}
              </div>
              <label className="text-sm font-medium mt-2">Total</label>
              <div className="text-sm text-gray-700">AED {orderDetails?.totalAmount}</div>
            </>
          )}

          <div className="mt-4">
            <label className="text-sm font-medium block">Order Status</label>
            <select
              value={formData.status || orderDetails?.order_status || ""}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className={`border p-2 w-full rounded ${highlightIfChanged(orderDetails?.order_status, formData.status)}`}
            >
              <option value="">Select</option>
              {ORDER_STATUS_OPTIONS.map((opt) => <option key={opt}>{opt}</option>)}
            </select>
          </div>
          <div className="mt-2">
            <label className="text-sm font-medium block">Payment Status</label>
            <select
              value={formData.paymentStatus || orderDetails?.paymentStatus || ""}
              onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
              className={`border p-2 w-full rounded ${highlightIfChanged(orderDetails?.paymentStatus, formData.paymentStatus)}`}
            >
              <option value="">Select</option>
              {PAYMENT_STATUS_OPTIONS.map((opt) => <option key={opt}>{opt}</option>)}
            </select>
          </div>
          <div className="mt-2">
            <label className="text-sm font-medium block">Payment Method</label>
            <select
              value={formData.paymentMethod || orderDetails?.paymentMethod || ""}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              className={`border p-2 w-full rounded ${highlightIfChanged(orderDetails?.paymentMethod, formData.paymentMethod)}`}
            >
              <option value="">Select</option>
              {PAYMENT_METHOD_OPTIONS.map((opt) => <option key={opt}>{opt}</option>)}
            </select>
          </div>

          <button
            onClick={handleSubmit}
            className="bg-black text-white py-2 px-4 rounded-md mt-4 w-full"
          >
            {isNewOrder ? "Create Order" : "Update Order"}
          </button>
        </div>

        <div className="space-y-2 md:col-span-2">
          <h3 className="text-base font-semibold mb-2">Shipping Info</h3>
          <div className="grid grid-cols-2 gap-3">
            <input className="border p-2 rounded" placeholder="Customer Name" value={formAddress.customer_name} onChange={(e) => setFormAddress({ ...formAddress, customer_name: e.target.value })} />
            <input className="border p-2 rounded" placeholder="Phone" value={formAddress.phone} onChange={(e) => setFormAddress({ ...formAddress, phone: e.target.value })} />
            <input className="border p-2 rounded col-span-2" placeholder="Address" value={formAddress.address} onChange={(e) => setFormAddress({ ...formAddress, address: e.target.value })} />
            <input className="border p-2 rounded" placeholder="City" value={formAddress.city} onChange={(e) => setFormAddress({ ...formAddress, city: e.target.value })} />
            <input className="border p-2 rounded" placeholder="Pincode" value={formAddress.pincode} onChange={(e) => setFormAddress({ ...formAddress, pincode: e.target.value })} />
            <textarea className="border p-2 rounded col-span-2" placeholder="Notes" value={formAddress.notes} onChange={(e) => setFormAddress({ ...formAddress, notes: e.target.value })} />
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-base font-semibold mb-3">Order Items</h3>
        <div className="flex gap-2 mb-3">
          <input className="border p-2 rounded w-full" placeholder="Search product..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <input className="border p-2 rounded w-20" type="number" min={1} value={newProductQty} onChange={(e) => setNewProductQty(parseInt(e.target.value))} />
        </div>
        {searchResults.length > 0 && (
          <ul className="border bg-white rounded divide-y mb-4">
            {searchResults.map((p) => (
              <li key={p._id} className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleAddProduct(p)}>{p.title} – AED {p.price}</li>
            ))}
          </ul>
        )}
        <ul className="space-y-2">
          {formProducts.map((item, idx) => (
            <li key={idx} className="flex justify-between items-center border p-2 rounded">
              <div>
                <div className="font-medium">{item?.productId?.title || item?.title}</div>
                <div className="text-xs text-muted-foreground">AED {item?.price}</div>
              </div>
              <div className="flex items-center gap-2">
                <input className="border p-1 rounded w-16" type="number" min={1} value={item.quantity} onChange={(e) => handleQuantityChange(idx, e.target.value)} />
                <button onClick={() => handleRemoveItem(idx)} className="text-red-500 text-xs">Remove</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {!isNewOrder && orderDetails?.order_status !== "refunded" && orderDetails?.order_status !== "cancelled" && (
        <div className="mt-10 border-t pt-6">
          <h3 className="text-base font-semibold mb-3">Return / Refund</h3>
          <div className="grid gap-3 max-w-lg">
            <input type="number" placeholder="Refund Amount (AED)" value={refundAmount} onChange={(e) => setRefundAmount(Number(e.target.value))} className="border p-2 rounded" />
            <textarea placeholder="Refund Reason (optional)" value={refundReason} onChange={(e) => setRefundReason(e.target.value)} className="border p-2 rounded" />
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={restockItems} onChange={() => setRestockItems(!restockItems)} />
              Restock returned items
            </label>
            <button onClick={handleRefundSubmit} className="bg-red-600 text-white px-4 py-2 rounded w-fit">Process Refund</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrderDetailsView;