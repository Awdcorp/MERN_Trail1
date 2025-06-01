import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { fetchCartItems, applyCouponToCart, removeCouponFromCart } from "@/store/shop/cart-slice";
import { getGuestId } from "@/lib/guest-id";

export default function FullCartPage() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.shopCart.cartItems || []);
  const appliedCoupon = useSelector((state) => state.shopCart.appliedCoupon);
  const { toast } = useToast();
  const [couponCode, setCouponCode] = useState("");

  // ✅ Fetch latest cart from backend
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const guestId = getGuestId();
    dispatch(fetchCartItems(userId || guestId));
  }, [dispatch]);

  const subtotal = cartItems.reduce(
    (sum, item) =>
      sum + (item.salePrice > 0 ? item.salePrice : item.price) * item.quantity,
    0
  );

  const handleApplyCoupon = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/coupons/validate`, {
        code: couponCode,
        amount: subtotal,
      });
      if (res.data.success) {
        dispatch(applyCouponToCart(res.data.data)); // ✅ Save to Redux
        toast({ title: "Coupon applied" });
        setCouponCode(""); // Optional reset
      } else {
        toast({ title: res.data.message || "Invalid coupon", variant: "destructive" });
      }
    } catch (err) {
      console.error("[Coupon Apply Error]", err);
      toast({ title: "Failed to apply coupon", variant: "destructive" });
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCouponFromCart());
    toast({ title: "Coupon removed" });
  };

  const discount = appliedCoupon
    ? Math.min(
        appliedCoupon.type === "fixed"
          ? appliedCoupon.value
          : (subtotal * appliedCoupon.value) / 100,
        appliedCoupon.maxDiscount || Infinity
      )
    : 0;

  const finalTotal = subtotal - discount;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="divide-y mb-6">
            {cartItems.map((item) => (
              <li key={item._id} className="py-4 flex justify-between items-center">
                <span>{item.title} x {item.quantity}</span>
                <span>₹{((item.salePrice > 0 ? item.salePrice : item.price) * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>

          {!appliedCoupon ? (
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <Button onClick={handleApplyCoupon}>Apply</Button>
            </div>
          ) : (
            <div className="flex justify-between items-center mb-4 bg-green-50 px-3 py-2 rounded border border-green-200">
              <span className="text-green-700 text-sm font-medium">
                ✅ Coupon <strong>{appliedCoupon.code}</strong> applied
              </span>
              <Button size="sm" variant="ghost" onClick={handleRemoveCoupon}>
                Remove
              </Button>
            </div>
          )}

          <div className="text-sm space-y-1">
            <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
            {appliedCoupon && (
              <p className="text-green-600">
                Discount ({appliedCoupon.code}): -₹{discount.toFixed(2)}
              </p>
            )}
            <p className="font-semibold text-lg">Total: ₹{finalTotal.toFixed(2)}</p>
          </div>
        </>
      )}
    </div>
  );
}
