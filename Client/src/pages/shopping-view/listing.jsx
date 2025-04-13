import ProductFilter from "@/components/shopping-view/filter";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { sortOptions } from "@/config";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchProductDetails } from "@/store/shop/products-slice";
import { ArrowUpDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import categoryBanners from "@/assets/categoryBanners.js";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];
  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");
      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }
  return queryParams.join("&");
}

function ShoppingListing() {
  const dispatch = useDispatch();
  const { productDetails } = useSelector((state) => state.shopProducts);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(null);
  const [searchParams] = useSearchParams();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [visibleCount, setVisibleCount] = useState(24);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const { toast } = useToast();

  const categorySearchParam = searchParams.get("category");
  const bannerImage = categoryBanners[categorySearchParam] ||
  "https://res.cloudinary.com/dyiupjfwp/image/upload/v1744509081/partyworld/occasions/hhkw5aallqijfwycgj13.jpg";

  function handleSort(value) {
    setSort(value);
  }

  function handleFilter(getSectionId, getCurrentOption, checked) {
    if (getSectionId === "clear") {
      setFilters({});
      sessionStorage.setItem("filters", JSON.stringify({}));
      return;
    }

    let cpyFilters = { ...filters };
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

    if (indexOfCurrentSection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption],
      };
    } else {
      const indexOfCurrentOption =
        cpyFilters[getSectionId].indexOf(getCurrentOption);

      if (indexOfCurrentOption === -1)
        cpyFilters[getSectionId].push(getCurrentOption);
      else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
    }

    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });
          return;
        }
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({ title: "Product is added to cart" });
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

  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, [categorySearchParam]);

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters);
    }
  }, [filters]);

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    setVisibleCount(10);
  }, [filters, sort]);

  useEffect(() => {
    const categorySlug = searchParams.get("category");
    if (!categorySlug) return;

    axios
      .get(`http://localhost:5000/api/products/category/${categorySlug}`)
      .then((res) => {
        setCategoryProducts(res.data.products);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch products by slug:", err);
      });
  }, [searchParams]);

  return (
    <>
{categorySearchParam && (
  <div
    className="w-full h-[200px] md:h-[280px] bg-cover bg-center flex items-center justify-center"
    style={{ backgroundImage: `url("${bannerImage}")` }}
  >
    <h1 className="text-[#46396F] text-3xl md:text-4xl font-medium text-center px-6 py-3 rounded-md">
      {categorySearchParam.replace(/-/g, " ").toUpperCase()}
    </h1>
  </div>
)}




      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6 p-4 md:p-6">
      <div className="md:block w-full md:w-auto">
  <div className="mb-4">
    <button
      className="px-4 py-2 bg-[#EB6123] text-white rounded font-semibold uppercase w-full md:pointer-events-none flex items-center justify-start gap-2"
      onClick={() => setShowFilters((prev) => !prev)}
    >
        
  <svg
    className={`w-4 h-4 transition-transform duration-300 md:hidden ${
      showFilters ? "rotate-180" : ""
    }`}
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

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 p-3">
            {getFilteredCategoryProducts()
              .slice(0, visibleCount)
              .map((productItem) => (
                <ShoppingProductTile
                  key={productItem._id}
                  handleGetProductDetails={handleGetProductDetails}
                  product={productItem}
                  handleAddtoCart={handleAddtoCart}
                />
              ))}
          </div>
          {getFilteredCategoryProducts().length > visibleCount && (
            <div className="text-center my-6">
              <Button onClick={() => setVisibleCount((prev) => prev + 24)}>
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

export default ShoppingListing;