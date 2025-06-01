import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { useToast } from "@/components/ui/use-toast";
import { getGuestId } from "@/lib/guest-id";
import { fetchCartItems } from "@/store/shop/cart-slice";

function ShoppingCheckout() {
  const dispatch = useDispatch();
  const { cartItems, appliedCoupon } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymemntStart] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const guestId = getGuestId();
    const cartId = userId || guestId;
    if (cartId) dispatch(fetchCartItems(cartId));
  }, [dispatch]);

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

  const discount = appliedCoupon
    ? Math.min(
        appliedCoupon.type === "fixed"
          ? appliedCoupon.value
          : (totalCartAmount * appliedCoupon.value) / 100,
        appliedCoupon.maxDiscount || Infinity
      )
    : 0;

  const finalAmount = totalCartAmount - discount;

  function handleInitiatePaypalPayment() {
    if (!cartItems || cartItems.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: "destructive",
      });
      return;
    }

    if (currentSelectedAddress === null) {
      toast({
        title: "Please select one address to proceed.",
        variant: "destructive",
      });
      return;
    }

    const guestId = getGuestId();

    const orderData = {
      userId: user?.id || guestId,
      guestId,
      cartItems: cartItems.map((item) => ({
        productId: item?.productId,
        title: item?.title,
        image: item?.image,
        price: item?.salePrice > 0 ? item?.salePrice : item?.price,
        quantity: item?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "pending",
      totalAmount: finalAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
      appliedCoupon: appliedCoupon || null, // ✅ include applied coupon
    };

    dispatch(createNewOrder(orderData)).then((data) => {
      if (data?.payload?.success) {
        setIsPaymemntStart(true);
      } else {
        setIsPaymemntStart(false);
      }
    });
  }

  if (approvalURL) {
    window.location.href = approvalURL;
  }

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img
          src="https://res.cloudinary.com/dyiupjfwp/image/upload/v1747470944/partyworld/occasions/vifgyalvepowqaw1rtwy.png"
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 py-8 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28 xl:py-28 ">
        {/* Address Selection */}
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />

        {/* Right Section: Products + Payment */}
        <div className="flex flex-col gap-4 lg:pl-12">
          {/* 🛒 Scrollable Cart Items */}
          <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-2">
            {cartItems && cartItems.length > 0 ? (
              cartItems.map((item) => (
                <UserCartItemsContent key={item.productId} cartItem={item} />
              ))
            ) : (
              <div className="text-gray-500 text-sm">
                No items in cart to checkout.
              </div>
            )}
          </div>

          {/* 💰 Total */}
          <div className="mt-4 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="font-bold">Subtotal</span>
              <span className="font-bold">AED {totalCartAmount.toFixed(2)}</span>
            </div>

            {appliedCoupon && (
              <div className="flex justify-between text-green-700">
                <span>
                  Discount ({appliedCoupon.code})
                </span>
                <span>- AED {discount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between font-semibold text-base">
              <span>Total</span>
              <span>AED {finalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* 💳 Checkout */}
          <div className="mt-2 w-full flex justify-end">
            <Button
              onClick={handleInitiatePaypalPayment}
              className="w-auto"
              disabled={isPaymentStart}
            >
              {isPaymentStart
                ? "Processing Paypal Payment..."
                : "Checkout with Paypal"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
