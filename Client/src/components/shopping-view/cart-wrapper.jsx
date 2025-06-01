import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";
import { useSelector } from "react-redux";

function UserCartWrapper({ setOpenCartSheet }) {
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.shopCart.cartItems || []);

  // ✅ Calculate total amount from cart
  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  return (
    <SheetContent className="sm:max-w-md">
      <SheetHeader>
        <SheetTitle>Your Cart</SheetTitle>
      </SheetHeader>

      <div className="mt-8 space-y-4 overflow-y-auto max-h-[60vh] pr-2">
        {cartItems && cartItems.length > 0 ? (
          cartItems.map((item) => {
            // ✅ Normalizing ID here for use as React key
            const resolvedId =
              typeof item.productId === "object"
                ? item.productId?._id
                : item.productId;

            return (
              <UserCartItemsContent
                key={resolvedId}
                cartItem={item}
              />
            );
          })
        ) : (
          <div className="text-sm text-gray-600">Your cart is empty.</div>
        )}
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex justify-between">
          <span className="font-bold">Total</span>
          <span className="font-bold">AED {totalCartAmount}</span>
        </div>
      </div>
{/* New Buttons for Cart Page Access */}
<div className="flex flex-col gap-2 mt-4">
  <Button
    variant="outline"
    onClick={() => {
      navigate("/shop/cart");
      setOpenCartSheet(false);
    }}
  >
    Apply Coupon
  </Button>
  <Button
    variant="secondary"
    onClick={() => {
      navigate("/shop/cart");
      setOpenCartSheet(false);
    }}
  >
    View Full Cart
  </Button>
</div>

      <Button
        onClick={() => {
          navigate("/shop/checkout");
          setOpenCartSheet(false);
        }}
        className="w-full mt-6"
      >
        Checkout
      </Button>
    </SheetContent>
  );
}

export default UserCartWrapper;
