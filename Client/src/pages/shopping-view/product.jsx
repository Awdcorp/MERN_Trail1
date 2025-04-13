// File: Client/src/pages/shopping-view/product-page.jsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StarIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartItems, addToCart } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import StarRatingComponent from "@/components/common/star-rating";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProductPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { reviews } = useSelector((state) => state.shopReview);
  const { toast } = useToast();

  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewMsg, setReviewMsg] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/products/slug/${slug}`)
      .then((res) => {
        setProduct(res.data);
        dispatch(getReviews(res.data._id));
      })
      .catch((err) => {
        console.error("❌ Failed to fetch product by slug:", err);
      });
  }, [slug]);

  function handleAddToCart() {
    const existing = cartItems.items || [];
    const index = existing.findIndex((item) => item.productId === product?._id);

    if (index > -1 && existing[index].quantity + 1 > product?.totalStock) {
      toast({
        title: `Only ${existing[index].quantity} quantity can be added for this item`,
        variant: "destructive",
      });
      return;
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: product?._id,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({ title: "Product is added to cart" });
      }
    });
  }

  function handleAddReview() {
    dispatch(
      addReview({
        productId: product?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data.payload.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(product?._id));
        toast({ title: "Review added successfully!" });
      }
    });
  }

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  if (!product) return <div className="p-10">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
      <div>
        <img
          src={product.images?.[0] || "/placeholder.png"}
          alt={product.title}
          className="w-full h-auto rounded-lg object-contain"
        />
      </div>
      <div>
        <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
        <div
          className="prose max-w-none mb-4 text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: product.description || "" }}
        ></div>

        <div className="mb-4 flex items-center gap-4">
          <p className={`text-3xl font-bold text-primary ${product.salePrice > 0 ? "line-through" : ""}`}>
            ${product.price}
          </p>
          {product.salePrice > 0 && <p className="text-2xl font-semibold">${product.salePrice}</p>}
        </div>

        <div className="flex items-center gap-2 mb-4">
          <StarRatingComponent rating={averageReview} />
          <span className="text-muted-foreground text-sm">({averageReview.toFixed(2)})</span>
        </div>

        <div className="mb-6">
          {product.totalStock === 0 ? (
            <Button className="opacity-60 cursor-not-allowed w-full" disabled>Out of Stock</Button>
          ) : (
            <Button className="w-full" onClick={handleAddToCart}>Add to Cart</Button>
          )}
        </div>

        <Separator className="my-6" />

        <div className="max-h-[300px] overflow-auto">
          <h2 className="text-xl font-bold mb-4">Reviews</h2>
          <div className="grid gap-6">
            {reviews && reviews.length > 0 ? (
              reviews.map((reviewItem) => (
                <div className="flex gap-4">
                  <Avatar className="w-10 h-10 border">
                    <AvatarFallback>{reviewItem?.userName[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold">{reviewItem?.userName}</h3>
                    <StarRatingComponent rating={reviewItem?.reviewValue} />
                    <p className="text-muted-foreground text-sm">{reviewItem.reviewMessage}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm">No reviews yet.</p>
            )}

            <div className="mt-8">
              <Label>Write a review</Label>
              <div className="flex gap-2 my-2">
                <StarRatingComponent rating={rating} handleRatingChange={setRating} />
              </div>
              <Input
                value={reviewMsg}
                onChange={(e) => setReviewMsg(e.target.value)}
                placeholder="Write a review..."
              />
              <Button
                className="mt-2"
                onClick={handleAddReview}
                disabled={reviewMsg.trim() === "" || rating === 0}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}