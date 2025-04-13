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

export default function ProductPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

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

  const handleAddToCart = () => {
    if (!product || product.totalStock === 0) return;
    dispatch(
      addToCart({
        userId: user?.id,
        productId: product._id,
        quantity,
      })
    ).then(() => {
      dispatch(fetchCartItems(user?.id));
    });
  };

  if (!product) return <div className="p-10 text-center">Product not found.</div>;

  return (
    <>
      {/* 🧱 Main Product Layout */}
      <div className="w-full max-w-6xl mx-auto px-6 md:px-10 py-10">
        <div className="flex flex-col md:flex-row gap-10 items-start">
          {/* 🖼️ Product Image */}
          <div className="w-full md:w-[45%] flex justify-center">
            <img
              src={product.images?.[0] || "/placeholder.png"}
              alt={product.title}
              className="max-w-[400px] h-[400px] object-contain border rounded-xl"
            />
          </div>

          {/* 📋 Product Info */}
          <div className="w-full md:w-[55%] space-y-4">
            <h1 className="text-2xl md:text-2xl font-thin text-[#46396F]">{product.title}</h1>

            <div className="text-xl font-light text-[#334155]">
              {product.salePrice > 0 ? (
                <>
                  <span className="line-through text-gray-500 mr-2">{product.price} AED</span>
                  <span className="text-[#EB6123]">{product.salePrice} AED</span>
                </>
              ) : (
                <>{product.price} AED</>
              )}
            </div>

            <div className="text-green-600 font-medium">
              {product.totalStock > 10
                ? "In stock"
                : product.totalStock > 0
                ? `Only ${product.totalStock} left in stock`
                : "Out of stock"}
            </div>

            {/* 🛒 Quantity + Add to Cart */}
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
                onClick={handleAddToCart}
                disabled={product.totalStock === 0}
                className="bg-[#46396F] text-white rounded px-6"
              >
                Add To Cart
              </Button>
            </div>
          </div>
        </div>

        {/* 📄 Description */}
        <div className="mt-12 text-center">
          <h2 className="text-xl font-thin text-[#46396F] mb-6">Description</h2>
          <div
            className="prose prose-sm md:prose-base text-gray-700 mx-auto text-left font-light"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>
      </div>

      {/* 🎯 Full-Width Product Slider Section */}
      <div className="w-full bg-[#f9f9f9] py-10">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <ProductSliderSection
            title="Customers also purchased"
            categoryIds={["67f844b7f1275889ad3993b8"]} // Example categoryId
            sortBy="price-lowtohigh"
          />
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <ProductSliderSection
            title="You might also like"
            categoryIds={["67f844b7f1275889ad3993b8"]} // Example categoryId
            sortBy="price-lowtohigh"
          />
        </div>
      </div>
    </>
  );
}
