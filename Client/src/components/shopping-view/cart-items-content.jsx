import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { getGuestId } from "@/lib/guest-id";

function UserCartItemsContent({ cartItem }) {
  const { user } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.shopCart.cartItems || []);
  const productList = useSelector((state) => state.shopProducts.productList || []);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const resolvedProductId = cartItem?.productId;

  function handleUpdateQuantity(typeOfAction) {
    const indexInCart = cartItems.findIndex(
      (item) => item.productId === resolvedProductId
    );

    const indexInProducts = productList.findIndex(
      (product) => product._id === resolvedProductId
    );

    const getTotalStock = productList[indexInProducts]?.totalStock || 9999;
    const getQuantity = cartItems[indexInCart]?.quantity || 0;

    if (typeOfAction === "plus" && getQuantity + 1 > getTotalStock) {
      toast({
        title: `Only ${getTotalStock} in stock`,
        variant: "destructive",
      });
      return;
    }

    const guestId = user?.id ? null : getGuestId();

    dispatch(
      updateCartQuantity({
        userId: user?.id || null,
        guestId,
        productId: resolvedProductId,
        quantity: typeOfAction === "plus" ? getQuantity + 1 : getQuantity - 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({ title: "Cart item updated" });
      } else {
        toast({ title: "Update failed", variant: "destructive" });
      }
    });
  }

  function handleCartItemDelete() {
    const guestId = user?.id ? null : getGuestId();

    dispatch(
      deleteCartItem({
        userId: user?.id || null,
        guestId,
        productId: resolvedProductId,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({ title: "Cart item removed" });
      } else {
        toast({ title: "Error deleting item", variant: "destructive" });
      }
    });
  }

  return (
    <div className="flex items-center space-x-4">
      <img
        src={cartItem?.image}
        alt={cartItem?.title}
        className="w-20 h-20 rounded object-cover"
      />
      <div className="flex-1">
        <h3 className="font-extrabold">{cartItem?.title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full"
            size="icon"
            disabled={cartItem?.quantity === 1}
            onClick={() => handleUpdateQuantity("minus")}
          >
            <Minus className="w-4 h-4" />
          </Button>
          <span className="font-semibold">{cartItem?.quantity}</span>
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full"
            size="icon"
            onClick={() => handleUpdateQuantity("plus")}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="font-semibold">
          AED{" "}
          {(
            (cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) *
            cartItem?.quantity
          ).toFixed(2)}
        </p>
        <Trash
          onClick={handleCartItemDelete}
          className="cursor-pointer mt-1"
          size={20}
        />
      </div>
    </div>
  );
}

export default UserCartItemsContent;
