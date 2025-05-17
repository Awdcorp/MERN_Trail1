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
import PromateShowcaseSection from "@/components/shopping-view/YouMightAlsoLikeSection";

export default function ProductPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [upsellProducts, setUpsellProducts] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("description");

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
              params: { ids: res.data.upsellProductIds.join(","), limit: 5 },
            })
            .then((res2) => setUpsellProducts(res2.data.products || []));
        }
        if (res.data.relatedProductIds?.length > 0) {
          axios
            .get(`${import.meta.env.VITE_API_URL}/api/products/multiple`, {
              params: { ids: res.data.relatedProductIds.join(","), limit: 5 },
            })
            .then((res3) => setRelatedProducts(res3.data.products || []));
        }
        dispatch(getReviews(res.data._id));
      })
      .catch((err) => {
        console.error("❌ Failed to fetch product by slug:", err);
      });
  }, [slug]);

  function handleAddToCart(productId, stock) {
    const isGuest = !user?.id;
    const guestId = isGuest ? getGuestId() : null;

    dispatch(
      addToCart({
        userId: !isGuest ? user.id : null,
        guestId,
        productId,
        quantity: quantity,
      })
    ).then((res) => {
      if (res?.payload?.success) {
        dispatch(fetchCartItems(isGuest ? guestId : user.id));
        toast({
          title: "Added to Cart!",
          description: "The item was successfully added.",
        });
      }
    });
  }

  return (
    <div className="min-h-[600px] bg-white">
      {!product ? (
        <div className="p-10 text-center text-gray-500">Loading product...</div>
      ) : (
        <>
          <div className="w-full max-w-6xl mx-auto px-4 md:px-8 py-16">
            <div className="flex flex-col md:flex-row gap-10 items-start">
              {/* 📷 Vertical Thumbnails + Main Image */}
              <div className="w-full md:w-[45%] flex flex-row gap-4">
                {product.images?.length > 1 && (
                  <div className="flex flex-col gap-2">
                    {product.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Thumbnail ${idx}`}
                        className="w-14 h-14 object-contain border rounded-lg cursor-pointer hover:ring-2 ring-[#a5b4fc]"
                        onClick={() =>
                          setProduct((prev) => ({
                            ...prev,
                            images: [img, ...prev.images.filter((i) => i !== img)],
                          }))
                        }
                      />
                    ))}
                  </div>
                )}

                <div className="relative flex-1 flex justify-center">
                  {product.totalStock === 0 ? (
                    <span className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 text-xs rounded-full">
                      OUT OF STOCK
                    </span>
                  ) : product.salePrice > 0 ? (
                    <span className="absolute top-2 left-2 bg-[#a5b4fc] text-white px-3 py-1 text-xs rounded-full">
                      SALE
                    </span>
                  ) : null}

                  <img
                    src={product.images?.[0] || "/placeholder.png"}
                    alt={product.title}
                    className="w-full max-w-[400px] h-[400px] object-contain border rounded-xl shadow-sm"
                  />
                </div>
              </div>

              {/* 📝 Product Info Section */}
              <div className="w-full md:w-[55%] space-y-4 text-[#1f2937]">
                {product.brand && (
                  <div className="text-sm text-gray-400 uppercase tracking-wide">
                    {product.brand}
                  </div>
                )}

                <h1 className="text-2xl font-semibold">{product.title}</h1>

                <div className="font-medium text-lg">
                  {product.salePrice > 0 ? (
                    <>
                      <span className="line-through text-gray-400 mr-2">
                        {product.price} AED
                      </span>
                      <span className="text-[#a5b4fc]">{product.salePrice} AED</span>
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

                {/* 🧮 Quantity + Add to Cart */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-6">
                  <div className="flex items-center border rounded-md overflow-hidden">
                    <button
                      className="px-4 py-2 text-xl font-bold text-[#1f2937] disabled:opacity-30"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                    >
                      −
                    </button>
                    <div className="px-6 py-2 text-md">{quantity}</div>
                    <button
                      className="px-4 py-2 text-xl font-bold text-[#1f2937] disabled:opacity-30"
                      onClick={() => setQuantity((q) => Math.min(q + 1, product.totalStock))}
                      disabled={quantity >= product.totalStock}
                    >
                      +
                    </button>
                  </div>

                  <Button
                    onClick={() => handleAddToCart(product._id, product.totalStock || 9999)}
                    disabled={product.totalStock === 0}
                    className="bg-[#8f9df7] text-white font-semibold tracking-wide px-8 py-3 rounded-md w-full sm:w-auto"
                  >
                    ADD TO CART
                  </Button>
                </div>
              </div>
            </div>

            {/* 🗂️ Description / Reviews / Shipping */}
            <div className="mt-12 max-w-4xl mx-auto">
              <div className="flex justify-center gap-6 border-b pb-2 mb-6">
                {["description", "reviews", "shipping"].map((tab) => (
                  <button
                    key={tab}
                    className={`text-sm font-semibold pb-2 border-b-2 uppercase ${
                      activeTab === tab
                        ? "border-[#a5b4fc] text-[#1f2937]"
                        : "border-transparent text-gray-400 hover:text-[#1f2937]"
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab === "description"
                      ? "Description"
                      : tab === "reviews"
                      ? "Reviews"
                      : "Shipping Info"}
                  </button>
                ))}
              </div>

              {activeTab === "description" && (
                <div
                  className="prose prose-sm md:prose-base text-gray-700 text-left font-light"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              )}
              {activeTab === "reviews" && (
                <div className="text-gray-600 text-sm">
                  This product has no reviews yet. Be the first to review it!
                </div>
              )}
              {activeTab === "shipping" && (
                <div className="text-gray-600 text-sm space-y-2">
                  <p>✅ Free shipping on orders above 100 AED</p>
                  <p>🚚 Delivery in 2–4 business days</p>
                  <p>🔁 Easy 7-day returns</p>
                </div>
              )}
            </div>
          </div>

          {/* 💡 Related + Upsell */}
          <div className="w-full py-10">
            {relatedProducts.length > 0 && (
              <div className="mt-16 max-w-6xl mx-auto px-4">
                <h2 className="text-xl md:text-2xl font-semibold text-center mb-2 uppercase text-[#1f2937]">
                  You Might Also Like
                </h2>
                <div className="w-[100px] h-[2px] bg-gray-200 mx-auto mb-6" />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                  {upsellProducts.map((productItem) => (
                    <ShoppingProductTile
                      key={productItem._id}
                      product={productItem}
                      handleAddtoCart={() =>
                        handleAddToCart(productItem._id, productItem.totalStock || 9999)
                      }
                    />
                  ))}
                </div>
              </div>
            )}

            {relatedProducts.length > 0 && (
              <div className="mt-16 max-w-6xl mx-auto px-4">
                <h2 className="text-xl md:text-2xl font-semibold text-center mb-2 uppercase text-[#1f2937]">
                  Customers Also Purchased
                </h2>
                <div className="w-[100px] h-[2px] bg-gray-200 mx-auto mb-6" />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                  {relatedProducts.map((productItem) => (
                    <ShoppingProductTile
                      key={productItem._id}
                      product={productItem}
                      handleAddtoCart={() =>
                        handleAddToCart(productItem._id, productItem.totalStock || 9999)
                      }
                    />
                  ))}
                </div>
              </div>
            )}
            <PromateShowcaseSection />
          </div>
        </>
      )}
    </div>
  );
}