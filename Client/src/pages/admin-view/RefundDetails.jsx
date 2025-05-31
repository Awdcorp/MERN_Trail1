// File: RefundDetails.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function RefundDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("📡 Fetching refund details for order:", id);

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/admin/orders/details/${id}`)
      .then((res) => {
        console.log("✅ Refund order fetch success:", res.data.data);
        setOrder(res.data.data);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch refund order", err);
      })
      .finally(() => {
        console.log("⏹ Finished refund details fetch cycle");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-6">Loading refund details...</div>;
  if (!order || !order.refund) return <div className="p-6 text-red-500">No refund record found for this order.</div>;

  const refund = order.refund;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Refund Details</h1>

      <div className="mb-4">
        <Link to={`/admin/orders`} className="text-blue-600 underline">
          ← Back to Orders
        </Link>
      </div>

      <div className="grid gap-4 text-sm border p-4 rounded bg-white shadow">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Order ID</span>
          <span className="font-medium">{order._id}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Refunded Amount</span>
          <span className="font-semibold text-black">AED {refund.amount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Refund Date</span>
          <span>{new Date(refund.refundedAt).toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Refund Method</span>
          <span>{refund.method || "—"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Card</span>
          <span>{refund.cardBrand || "—"} ****{refund.cardLast4 || "—"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Gateway</span>
          <span>{refund.gateway || "—"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Gateway Refund ID</span>
          <span>{refund.gatewayRefundId || "—"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Refund Status</span>
          <span className="font-semibold text-green-700">{refund.status}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Restock Items</span>
          <span>{refund.restock ? "Yes" : "No"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Refunded By</span>
          <span>{refund.refundedBy || "System"}</span>
        </div>
        {refund.reason && (
          <div>
            <span className="text-muted-foreground block mb-1">Refund Reason</span>
            <div className="border p-2 rounded bg-muted whitespace-pre-wrap">
              {refund.reason}
            </div>
          </div>
        )}
      </div>

      {Array.isArray(refund.history) && refund.history.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Refund Activity Log</h2>
          <ul className="border rounded bg-white shadow divide-y text-sm">
            {refund.history.map((entry, idx) => (
              <li key={idx} className="px-4 py-2">
                <span className="text-muted-foreground block text-xs mb-1">
                  {new Date(entry.time).toLocaleString()}
                </span>
                <span className="text-black">{entry.message}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
