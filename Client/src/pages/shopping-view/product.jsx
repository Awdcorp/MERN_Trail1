// File: Client/src/pages/shopping-view/product.jsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import ProductSliderSection from "@/components/shopping-view/newarrivalsslider";
import { getReviews } from "@/store/shop/review-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { getGuestId } from "@/lib/guest-id";
import { useToast } from "@/components/ui/use-toast";

export default function ProductPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [upsellProducts, setUpsellProducts] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    setProduct(null);
    setUpsellProducts([]);
    setRelatedProducts([]);
  }, [slug]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/products/slug/${slug}`)
      .then((res) => {
        setProduct(res.data);

        if (res.data.upsellProductIds?.length > 0) {
          axios
            .get(`${import.meta.env.VITE_API_URL}/api/products/multiple`, {
              params: {
                ids: res.data.upsellProductIds.join(","),
                limit: 5,
              },
            })
            .then((res2) => {
              setUpsellProducts(res2.data.products || []);
            });
        }

        if (res.data.relatedProductIds?.length > 0) {
          axios
            .get(`${import.meta.env.VITE_API_URL}/api/products/multiple`, {
              params: {
                ids: res.data.relatedProductIds.join(","),
                limit: 5,
              },
            })
            .then((res3) => {
              setRelatedProducts(res3.data.products || []);
            });
        }

        dispatch(getReviews(res.data._id));
      })
      .catch((err) => {
        console.error("❌ Failed to fetch product by slug:", err);
      });
  }, [slug]);

  function handleAddToCart(productId, stock) {
    const guestId = user?.id ? null : getGuestId();

    dispatch(
      addToCart({
        userId: user?.id || null,
        guestId,
        productId,
        quantity: 1,
      })
    ).then((res) => {
      if (res?.payload?.success) {
        dispatch(fetchCartItems(user?.id || guestId));
        toast({
          title: "Added to Cart!",
          description: "The item was successfully added.",
        });
      }
    });
  }
  
  return (
    <div className="min-h-[600px]"> {/* ✅ Ensures space even while loading */}
      {!product ? (
        <div className="p-10 text-center text-gray-500">Loading product...</div>
      ) : (
        <>
          <div className="w-full max-w-6xl mx-auto px-6 md:px-10 py-16">
            <div className="flex flex-col md:flex-row gap-10 items-start">
              <div className="w-full md:w-[45%] flex justify-center">
                <img
                  src={product.images?.[0] || "/placeholder.png"}
                  alt={product.title}
                  className="max-w-[400px] h-[400px] object-contain border rounded-xl"
                />
              </div>

              <div className="w-full md:w-[55%] space-y-4">
                <h1 className="text-2xl md:text-2xl font-medium text-[#46396F]">{product.title}</h1>
                <div className="font-medium text-[#334155]">
                  {product.salePrice > 0 ? (
                    <>
                      <span className="line-through text-gray-500 mr-2">{product.price} AED</span>
                      <span className="text-[#EB6123]">{product.salePrice} AED</span>
                    </>
                  ) : (
                    <>{product.price}.00 AED</>
                  )}
                </div>

                <div className="text-green-600 font-medium">
                  {product.totalStock > 10
                    ? "In stock"
                    : product.totalStock > 0
                    ? `Only ${product.totalStock} left in stock`
                    : "Out of stock"}
                </div>

                <div className="flex items-center gap-4 mt-4">
                  <Input
                    type="number"
                    value={quantity}
                    min={1}
                    max={product.totalStock}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-20"
                  />
                  <Button
                    onClick={() => handleAddToCart(product._id, product.totalStock || 9999)}
                    disabled={product.totalStock === 0}
                    className="bg-[#46396F] text-white rounded-3xl px-6"
                  >
                    Add To Cart
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <h2 className="text-xl font-medium text-[#46396F] mb-6">Description</h2>
              <div
                className="prose prose-sm md:prose-base text-gray-700 mx-auto text-left font-light"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          </div>

          <div className="w-full py-10">
            {relatedProducts.length > 0 && (
              <div className="mt-16">
                <div className="max-w-6xl mx-auto px-4">
                  <h2 className="text-xl md:text-2xl font-medium text-center mb-2 uppercase text-[#463970]">
                    You Might Also Like
                  </h2>
                  <div className="w-[100px] h-[2px] bg-[#A3A3A399] mx-auto mb-6" />
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                    {upsellProducts.map((productItem) => (
                      <ShoppingProductTile key={productItem._id} product={productItem} handleAddtoCart={() =>
                        handleAddToCart(productItem._id, productItem.totalStock || 9999)
                      } />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {relatedProducts.length > 0 && (
              <div className="mt-16">
                <div className="max-w-6xl mx-auto px-4">
                  <h2 className="text-xl md:text-2xl font-medium text-center mb-2 uppercase text-[#463970]">
                    Customers Also Purchased
                  </h2>
                  <div className="w-[100px] h-[2px] bg-[#A3A3A399] mx-auto mb-6" />
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                    {relatedProducts.map((productItem) => (
                      <ShoppingProductTile key={productItem._id} product={productItem} handleAddtoCart={() =>
                        handleAddToCart(productItem._id, productItem.totalStock || 9999)
                      } />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
