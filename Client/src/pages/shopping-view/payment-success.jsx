// ✅ FILE: Client/src/pages/shopping-view/payment-success.jsx

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersByUser } from "@/store/shop/order-slice";
import { getGuestId } from "@/lib/guest-id";

// 🆕 Reuse component
import ShoppingOrders from "@/components/shopping-view/orders";

function PaymentSuccessPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const ownerId = user?.id || getGuestId();

  useEffect(() => {
    dispatch(getAllOrdersByUser(ownerId));
  }, [dispatch, ownerId]);  

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">🎉 Payment Successful</h1>
      <p className="mb-6 text-muted-foreground">Thank you for your order. Here are your recent orders:</p>

      {/* ✅ Show full order list */}
      <ShoppingOrders ownerId={ownerId} />
    </div>
  );
}

export default PaymentSuccessPage;
