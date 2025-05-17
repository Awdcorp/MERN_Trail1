// File: src/pages/shopping-view/CategoryListingPage.jsx

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

import DemoProductTile from "@/components/shopping-view/DemoProductTile";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchProductDetails } from "@/store/shop/products-slice";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { getGuestId } from "@/lib/guest-id";

export default function CategoryListingPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { productDetails } = useSelector((state) => state.shopProducts);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [skipCount, setSkipCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isContentReady, setIsContentReady] = useState(false);

  const [sortBy, setSortBy] = useState("default");

  const categoryDescriptions = {
    birthday: "Shop fun, colorful birthday decorations for all ages and themes.",
    anniversary: "Celebrate milestones with elegant anniversary party supplies.",
    wedding: "Explore premium wedding decor, accessories, and themes.",
    "promate-accessories": "Promate tech accessories for mobile, laptop, and daily needs."
  };

const categoryBanners = {
  "samsung-phones": "https://res.cloudinary.com/dyiupjfwp/image/upload/v1747470794/partyworld/occasions/koeyo9d8hb85r9pfjpyg.png",
  "accessories": "https://res.cloudinary.com/dyiupjfwp/image/upload/v1747472347/partyworld/occasions/smrlhjhwj3ytf7pa3zj3.png",
  "promate-accessories": "",
  "powerbank": "",
  "xiaomi-accessories": "https://res.cloudinary.com/dyiupjfwp/image/upload/v1747470794/partyworld/occasions/koeyo9d8hb85r9pfjpyg.png",
  "earphones": "https://res.cloudinary.com/dyiupjfwp/image/upload/v1747470794/partyworld/occasions/koeyo9d8hb85r9pfjpyg.png",
  "anker-accessories": "",
  "xiaomi": "https://res.cloudinary.com/dyiupjfwp/image/upload/v1747470794/partyworld/occasions/koeyo9d8hb85r9pfjpyg.png",
  "oppo": "https://res.cloudinary.com/dyiupjfwp/image/upload/v1747470794/partyworld/occasions/koeyo9d8hb85r9pfjpyg.png",
  "samsung-accessories": "https://res.cloudinary.com/dyiupjfwp/image/upload/v1747470794/partyworld/occasions/koeyo9d8hb85r9pfjpyg.png",
  "huawei": "https://res.cloudinary.com/dyiupjfwp/image/upload/v1747471917/partyworld/occasions/lbyxpc356trmn12kv7wi.png",
  "iphone": "https://res.cloudinary.com/dyiupjfwp/image/upload/v1747470795/partyworld/occasions/kwfpbfxi7jlefcemyurv.png",
  "samsung-tablets": "https://res.cloudinary.com/dyiupjfwp/image/upload/v1747470794/partyworld/occasions/koeyo9d8hb85r9pfjpyg.png",
  "tablets": "https://res.cloudinary.com/dyiupjfwp/image/upload/v1747470795/partyworld/occasions/kwfpbfxi7jlefcemyurv.png",
  "iphone-tablets": "https://res.cloudinary.com/dyiupjfwp/image/upload/v1747470795/partyworld/occasions/kwfpbfxi7jlefcemyurv.png",
  "apple-accessories": "https://res.cloudinary.com/dyiupjfwp/image/upload/v1747470368/partyworld/occasions/jzspftl9rlbcsgyc3u5v.png ",
  "samsung-watches": "https://res.cloudinary.com/dyiupjfwp/image/upload/v1747470944/partyworld/occasions/vifgyalvepowqaw1rtwy.png",
  "watches": "https://res.cloudinary.com/dyiupjfwp/image/upload/v1747470944/partyworld/occasions/vifgyalvepowqaw1rtwy.png",
  "apple-watches": "https://res.cloudinary.com/dyiupjfwp/image/upload/v1747470368/partyworld/occasions/jzspftl9rlbcsgyc3u5v.png",
  default: "https://res.cloudinary.com/dyiupjfwp/image/upload/v1747472347/partyworld/occasions/smrlhjhwj3ytf7pa3zj3.png"
};


  function handleGetProductDetails(productId) {
    dispatch(fetchProductDetails(productId));
  }

  function handleAddtoCart(productId, totalStock) {
    const existing = cartItems.items || [];
    const index = existing.findIndex((item) => item.productId === productId);

    if (index > -1 && existing[index].quantity + 1 > totalStock) {
      toast({
        title: `Only ${existing[index].quantity} quantity can be added for this item`,
        variant: "destructive"
      });
      return;
    }

    const guestId = user?.id ? null : getGuestId();
    dispatch(
      addToCart({
        userId: user?.id || null,
        guestId,
        productId: productId,
        quantity: 1
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id || guestId));
        toast({ title: "Product is added to cart" });
      }
    });
  }

  const fetchProducts = () => {
    if (!slug) return;
    setIsContentReady(false);
    setCategoryProducts([]);

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/products/category/${slug}?limit=25&skip=${skipCount}`)
      .then((res) => {
        if (res.data.products?.length > 0) {
          if (skipCount === 0) {
            setCategoryProducts(res.data.products);
          } else {
            setCategoryProducts((prev) => [...prev, ...res.data.products]);
          }
          if (res.data.products.length < 25) setHasMore(false);
        } else {
          setCategoryProducts([]);
        }
        setIsContentReady(true);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch products:", err);
        setCategoryProducts([]);
        setIsContentReady(true);
      });
  };

  useEffect(() => {
    setSkipCount(0);
    setHasMore(true);
  }, [slug]);

  useEffect(() => {
    fetchProducts();
  }, [slug, skipCount]);

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  const showEmptyState = isContentReady && categoryProducts.length === 0;

  const getDisplayPrice = (product) => {
    const meta = product.meta || [];

    const saleMeta = meta.find((m) => m.key?.toLowerCase() === "saleprice");
    const priceMeta = meta.find((m) => m.key?.toLowerCase() === "price");

    const raw = saleMeta?.value ?? priceMeta?.value ?? 0;

    if (typeof raw === "string") {
      const cleaned = raw.replace(/[^\d.]/g, "");
      const final = parseFloat(cleaned) || 0;
      return final;
    }

    return typeof raw === "number" ? raw : 0;
  };

  return (
    <>
      <div
        className="w-full h-[200px] md:h-[280px] bg-cover bg-center mb-4"
        style={{
          backgroundImage: `url('${categoryBanners[slug] || categoryBanners.default}')`
        }}
      ></div>

      <div className="px-4 sm:px-6 md:px-10 lg:px-16 py-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-700 capitalize mb-4">
          {slug?.replace(/-/g, " ")}
        </h1>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
          {/* ✅ Improved breadcrumb with parent category support */}
          <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
            <Link to="/" className="text-gray-500 hover:underline">Shop</Link>
            <span>/</span>

            {/* Mapping child slugs to parent */}
            {(() => {
              const parentMap = {
                "promate-accessories": "accessories",
                "apple-accessories": "accessories",
                "anker-accessories": "accessories",
                "samsung-accessories": "accessories",
                "xiaomi-accessories": "accessories",
                "powerbank": "accessories",
                "earphones": "accessories",

                "samsung-phones": "phone",
                "iphone": "phone",
                "xiaomi": "phone",
                "oppo": "phone",

                "samsung-tablets": "tablets",
                "iphone-tablets": "tablets",
                "tablets": "tablets",

                "watches": "watches",
                "apple-watches": "watches",
                "samsung-watches": "watches"
              };

              const parent = parentMap[slug];

              return parent ? (
                <>
                  <Link
                    to={`/shop/category/${parent}`}
                    className="text-gray-500 capitalize hover:underline"
                  >
                    {parent.replace(/-/g, " ")}
                  </Link>
                  <span>/</span>
                </>
              ) : null;
            })()}

            <span className="text-[#54E060] capitalize font-medium">
              {slug?.replace(/-/g, " ")}
            </span>
          </nav>


          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-[#54E060] rounded-md px-3 py-1 text-sm text-gray-700 w-fit"
          >
            <option value="default">Sort By</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A–Z</option>
          </select>
        </div>

        <div className="w-full bg-background rounded-lg shadow-sm">
          <div className="p-3">
            {showEmptyState ? (
              <div className="text-center py-10 text-lg text-red-600 font-semibold">
                🚫 No products found for this category.
              </div>
            ) : (
              isContentReady && (
                <motion.div
                  key={slug + skipCount + sortBy}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3"
                >
                  {[...categoryProducts]
                    .sort((a, b) => {
                      const priceA = getDisplayPrice(a);
                      const priceB = getDisplayPrice(b);
                      if (sortBy === "price-asc") return priceA - priceB;
                      if (sortBy === "price-desc") return priceB - priceA;
                      if (sortBy === "name-asc") return a.title.localeCompare(b.title);
                      return 0;
                    })
                    .map((productItem) => (
                      <DemoProductTile
                        key={productItem._id}
                        product={productItem}
                        handleGetProductDetails={handleGetProductDetails}
                        handleAddtoCart={() =>
                          handleAddtoCart(productItem._id, productItem.totalStock || 9999)
                        }
                      />
                    ))}
                </motion.div>
              )
            )}
          </div>

          {isContentReady && categoryProducts.length > 0 && hasMore && (
            <div className="text-center pt-8 pb-8">
              <Button
                className="bg-[#54E060] text-white rounded-3xl px-6 py-2"
                onClick={() => setSkipCount((prev) => prev + 25)}
              >
                Load More
              </Button>
            </div>
          )}
        </div>

        <ProductDetailsDialog
          open={openDetailsDialog}
          setOpen={setOpenDetailsDialog}
          productDetails={productDetails}
        />
        <div className="px-4 py-8"></div>
      </div>
    </>
  );
}