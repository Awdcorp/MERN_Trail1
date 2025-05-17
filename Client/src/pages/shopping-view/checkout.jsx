import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { Navigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { getGuestId } from "@/lib/guest-id";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymemntStart] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();

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
      guestId, // ✅ Add this line
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
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
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
        <img src="https://res.cloudinary.com/dyiupjfwp/image/upload/v1747470944/partyworld/occasions/vifgyalvepowqaw1rtwy.png" className="h-full w-full object-cover object-center" />
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
          <div className="mt-4 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">AED {totalCartAmount}</span>
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
