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
import CategorySection from "@/components/shopping-view/occasioncategorysection";
import ProductSliderSection from "@/components/shopping-view/newarrivalsslider";
import HomepageSlider from "@/components/shopping-view/homepageslider";
import ThemeCategorySection from "@/components/shopping-view/themecategorysection";

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
        dispatch(fetchCartItems(user?.id || "guest"));
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
      
  
      {/* 🎭 Costume Category Product Slider */}
      <ProductSliderSection
        title="NEW ARRIVALS"
        categoryIds={["67f844b7f1275889ad3993b8"]}
        sortBy="price-lowtohigh"
        onAddToCart={handleAddtoCart}
      />
      <CategorySection groupName="Shop by Occasion" isSlider={true} />
      <ThemeCategorySection title="SHOP BY THEME" limit={4} />
      <ProductSliderSection
        title="BESTSELLERS"
        categoryIds={["67f7c88f2a38a098e8934182", "67f7d19ed107819e6545490a", "67f8278bcd23acad75619f75"]}
        sortBy="price-lowtohigh"
        onAddToCart={handleAddtoCart}
      />
      <CategorySection groupName="Plan Your Birthday" isSlider={true} />

      <div className="px-4 md:px-8 mt-10">
  <h2 className="text-2xl font-medium text-center mb-2 uppercase text-[#463970]">
  Party PACKAGES
  </h2>
  <div className="w-[140px] h-[1.9px] bg-[#A3A3A399] mx-auto mb-10" />

  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
  {[
  {
    name: "The Value Package",
    image: "https://partyworld.ae/wp-content/uploads/2025/03/children-celebrating-birthday-party-scaled-1.jpg",
    link: "the-value-package-2",
  },
  {
    name: "The Value Plus Package",
    image: "https://partyworld.ae/wp-content/uploads/2025/03/children-with-party-horns-celebrating-birthday-scaled-1.jpg",
    link: "the-value-plus-package-2",
  },
  {
    name: "The Premium Package",
    image: "https://partyworld.ae/wp-content/uploads/2025/03/group-happy-kids-with-colorful-candies-having-fun-birthday-party-isolated-white-scaled-1.jpg",
    link: "the-premium-package",
  },
  {
    name: "The Entertainment Package",
    image: "https://partyworld.ae/wp-content/uploads/2025/03/children-smiling-happiness-friendship-togetherness-celebration-studio-portrait-scaled-1.jpg",
    link: "the-entertainment-package",
  },
  {
    name: "The Superior Package",
    image: "https://partyworld.ae/wp-content/uploads/2025/03/children-holding-colorful-balloons-blowing-party-horn-during-birthday-scaled-1.jpg",
    link: "the-superior-package",
  },
  {
    name: "The Deluxe Package",
    image: "https://partyworld.ae/wp-content/uploads/2025/03/madness-birthday-party-scaled-1.jpg",
    link: "the-deluxe-package",
  },
  {
    name: "The Ultimate Package",
    image: "https://partyworld.ae/wp-content/uploads/2025/03/portrait-happy-friends-wearing-party-hat-standing-together-scaled-1.jpg",
    link: "the-ultimate-package",
  },
].map((item, idx) => (
  <a
    key={idx}
    href={`/shop/product/${item.link}`}
    className="flex flex-col items-center justify-center"
  >
    <img
      src={item.image}
      alt={item.name}
      className="w-full h-48 object-cover rounded-md mb-4"
    />
    <span
      className="text-sm text-center"
      style={{
        color: "#463970",
        fontSize: "15px",
        fontWeight: 400,
      }}
    >
      {item.name}
    </span>
  </a>
))}

  </div>
</div>


    </div>
  );
  
}

export default ShoppingHome;
