import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import ProductFilter from "@/components/shopping-view/filter";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchProductDetails } from "@/store/shop/products-slice";
import { useDispatch, useSelector } from "react-redux";

import categoryBanners from "@/assets/categoryBanners";
import { motion } from "framer-motion";
import { getGuestId } from "@/lib/guest-id";

export default function CategoryListingPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { productDetails } = useSelector((state) => state.shopProducts);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [filters, setFilters] = useState({});
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [skipCount, setSkipCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isContentReady, setIsContentReady] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const { toast } = useToast();

  const filteredProducts = getFilteredCategoryProducts();
  const showEmptyState = isContentReady && filteredProducts.length === 0;

  const bannerImage =
    categoryBanners[slug] ||
    "https://res.cloudinary.com/dyiupjfwp/image/upload/v1744509081/partyworld/occasions/hhkw5aallqijfwycgj13.jpg";

  function handleFilter(sectionId, option) {
    if (sectionId === "clear") {
      setFilters({});
      sessionStorage.setItem("filters", JSON.stringify({}));
      return;
    }

    let cpyFilters = { ...filters };
    if (!cpyFilters[sectionId]) {
      cpyFilters[sectionId] = [option];
    } else {
      const index = cpyFilters[sectionId].indexOf(option);
      if (index === -1) cpyFilters[sectionId].push(option);
      else cpyFilters[sectionId].splice(index, 1);
    }

    setFilters((prev) => {
      sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
      return { ...cpyFilters };
    });
  }

  function handleGetProductDetails(productId) {
    dispatch(fetchProductDetails(productId));
  }

  function handleAddtoCart(productId, totalStock) {
    const existing = cartItems.items || [];
    const index = existing.findIndex((item) => item.productId === productId);

    if (index > -1 && existing[index].quantity + 1 > totalStock) {
      toast({
        title: `Only ${existing[index].quantity} quantity can be added for this item`,
        variant: "destructive",
      });
      return;
    }
    const guestId = user?.id ? null : getGuestId();

    dispatch(
      addToCart({
        userId: user?.id || null,
        guestId,
        productId: productId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id || guestId));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  function getFilteredCategoryProducts() {
    if (Object.keys(filters).length === 0) return categoryProducts;

    return categoryProducts.filter((product) => {
      const productCategoryNames = product.categories.map((cat) => cat.name);
      for (const [key, selectedValues] of Object.entries(filters)) {
        if (selectedValues.length === 0) continue;
        const hasMatch = selectedValues.some((val) =>
          productCategoryNames.includes(val)
        );
        if (!hasMatch) return false;
      }
      return true;
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
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
    setSkipCount(0);
    setHasMore(true);
  }, [slug]);

  useEffect(() => {
    fetchProducts();
  }, [slug, skipCount]);

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  return (
    <>
      {slug && (
        <div className="w-full h-[200px] md:h-[280px] bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: `url("${bannerImage}")` }}>
          <div className="flex flex-col items-center text-center">
            <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
              <a href="/" className="text-[#46396F] hover:underline">Shop</a>
              <span>/</span>
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
                  "samsung-watches": "watches",
                };
                const parent = parentMap[slug];
                return parent ? (
                  <>
                    <a href={`/shop/category/${parent}`} className="text-[#46396F] capitalize hover:underline">
                      {parent.replace(/-/g, " ")}
                    </a>
                    <span>/</span>
                  </>
                ) : null;
              })()}
              <span className="text-[#46396F] capitalize font-medium">
                {slug?.replace(/-/g, " ")}
              </span>
            </nav>

            <h1 className="text-[#46396F] text-3xl md:text-4xl font-normal mt-2">
              {slug.replace(/-/g, " ").toUpperCase()}
            </h1>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6 p-4 md:pt-12 md:p-6">
        <div className="md:block w-full md:w-auto">
          <div className="mb-4">
            <button
              className="px-4 py-2 bg-[#EB6123] text-white rounded font-semibold uppercase w-full md:pointer-events-none flex items-center justify-start gap-2"
              onClick={() => setShowFilters((prev) => !prev)}
            >
              <svg
                className={`w-4 h-4 transition-transform duration-300 md:hidden ${showFilters ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
              <span>{showFilters ? "Hide Filters" : "Filters"}</span>
            </button>
          </div>
          <div className={`${showFilters ? "block" : "hidden"} md:block`}>
            <ProductFilter filters={filters} handleFilter={handleFilter} />
          </div>
        </div>

        <div className="bg-background w-full rounded-lg shadow-sm">
                    <div className="flex justify-end">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-[#46396F] rounded-md px-3 py-1 text-sm text-gray-700 w-fit"
            >
              <option value="default">Sort By</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A–Z</option>
            </select>
          </div>
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
                  {[...filteredProducts]
                    .sort((a, b) => {
                      const priceA = a.salePrice > 0 ? a.salePrice : a.price;
                      const priceB = b.salePrice > 0 ? b.salePrice : b.price;
                      if (sortBy === "price-asc") return priceA - priceB;
                      if (sortBy === "price-desc") return priceB - priceA;
                      if (sortBy === "name-asc") return a.title.localeCompare(b.title);
                      return 0;
                    })
                    .map((productItem) => (
                      <ShoppingProductTile
                        key={productItem._id}
                        handleGetProductDetails={handleGetProductDetails}
                        product={productItem}
                        handleAddtoCart={() =>
                          handleAddtoCart(productItem._id, productItem.totalStock || 9999)
                        }
                      />
                    ))}
                </motion.div>
              )
            )}
          </div>

          {isContentReady && filteredProducts.length > 0 && hasMore && (
            <div className="text-center pt-8 pb-8">
              <Button
                className="bg-[#463970] text-white rounded-3xl px-6 py-2"
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
      </div>
    </>
  );
}
