import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import bannerOne from "../../assets/banner-1.webp";
import bannerTwo from "../../assets/banner-2.webp";
import bannerThree from "../../assets/banner-3.webp";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { fetchAllFilteredProducts, fetchProductDetails } from "@/store/shop/products-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import OccasionCategorySection from "@/components/shopping-view/occasioncategorysection";
import ProductSliderSection from "@/components/shopping-view/newarrivalsslider";
import HomepageSlider from "@/components/shopping-view/homepageslider";

function ShoppingHome() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productList, productDetails } = useSelector((state) => state.shopProducts);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: { isFeatured: true },
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  const handleAddtoCart = (productId, stock) => {
    let currentItems = cartItems?.items || [];
    const foundIndex = currentItems.findIndex((item) => item.productId === productId);

    if (foundIndex > -1 && currentItems[foundIndex].quantity + 1 > stock) {
      toast({ title: `Only ${stock} items available`, variant: "destructive" });
      return;
    }

    dispatch(addToCart({ userId: user?.id, productId, quantity: 1 })).then((res) => {
      if (res?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({ title: "Added to cart!" });
      }
    });
  };

  const handleGetProductDetails = (id) => {
    dispatch(fetchProductDetails(id));
  };

  const occasions = [
    { name: "Birthday", image: "/placeholders/birthday.jpg", slug: "birthday" },
    { name: "Eid", image: "/placeholders/eid.jpg", slug: "eid" },
    { name: "Halloween", image: "/placeholders/halloween.jpg", slug: "halloween" },
    { name: "Graduation", image: "/placeholders/graduation.jpg", slug: "graduation" },
    { name: "Ramadan", image: "/placeholders/ramadan.jpg", slug: "ramadan" },
    { name: "Engagement", image: "/placeholders/engagement.jpg", slug: "engagement" },
    { name: "Gender Reveal", image: "/placeholders/gender-reveal.jpg", slug: "gender-reveal" },
  ];

  return (
    <div className="pt-0 pb-6 md:pb-10 px-4 md:px-6 space-y-6 md:space-y-10">
  
      {/* 🖼️ Responsive Full-Width Occasion Banner Slider */}
      <div className="-mx-8">
        <HomepageSlider />
      </div>
  
      {/* 🎯 Shop by Occasion Grid */}
      <OccasionCategorySection />
  
      {/* 🎭 Costume Category Product Slider */}
      <ProductSliderSection
        title="Costume Picks"
        categoryIds={["67f844b7f1275889ad3993b8"]}
        sortBy="price-lowtohigh"
      />
    </div>
  );
  
}

export default ShoppingHome;
