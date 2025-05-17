import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import TopOffersSlider from "@/components/shopping-view/topOffersSlider";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { fetchAllFilteredProducts, fetchProductDetails } from "@/store/shop/products-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import OccasionCategorySection from "@/components/shopping-view/occasioncategorysection";
import CategorySection from "@/components/shopping-view/occasioncategorysection";
import ProductSliderSection from "@/components/shopping-view/newarrivalsslider";
import HomepageSlider from "@/components/shopping-view/homepageslider";
import ThemeCategorySection from "@/components/shopping-view/themecategorysection";
import { PhoneCall } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import newArrivals from "@/components/shopping-view/newArrivals";
import newArrivals2 from "@/components/shopping-view/newArrivals2";
import { getGuestId } from "@/lib/guest-id";

const sliderProducts = newArrivals;

function ShoppingHome() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productList, productDetails } = useSelector((state) => state.shopProducts);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [relatedSliderProducts, setRelatedSliderProducts] = useState([]);

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

    const isGuest = !user?.id;
    const guestId = isGuest ? getGuestId() : null;

    dispatch(
      addToCart({
        userId: !isGuest ? user.id : null,
        guestId,
        productId,
        quantity: 1,
      })
    ).then((res) => {
      if (res?.payload?.success) {
        dispatch(fetchCartItems(isGuest ? guestId : user.id));
        toast({ title: "Product is added to cart" });
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

  const costumeCategoryIds = useMemo(() => ["67f844b7f1275889ad3993b8"], []);

  return (
    <div className="pt-0 pb-6 md:pb-10 space-y-6 md:space-y-10">
      {/* 🖼️ Responsive Full-Width Occasion Banner Slider */}
            {/* ✅ Two-Banner Full Width Slider (No Arrows, No Text) */}
            <section className="w-full">
              <Swiper
                spaceBetween={0}
                slidesPerView={1}
                loop={true}
                autoplay={{ delay: 3000 }}
                modules={[Autoplay]}
                className="w-full"
              >
                {[
                  "https://res.cloudinary.com/dyiupjfwp/image/upload/v1747470794/partyworld/occasions/koeyo9d8hb85r9pfjpyg.png",
                  "https://res.cloudinary.com/dyiupjfwp/image/upload/v1747470795/partyworld/occasions/kwfpbfxi7jlefcemyurv.png",
                  "https://res.cloudinary.com/dyiupjfwp/image/upload/v1747471919/partyworld/occasions/jcmc5fs4q34brff5tvg8.gif",
                  "https://res.cloudinary.com/dyiupjfwp/image/upload/v1747470796/partyworld/occasions/kes7xekdaweol98vdzkh.png"
                ].map((src, idx) => (
                  <SwiperSlide key={idx}>
                    <img
                      src={src}
                      alt={`Promo Banner ${idx + 1}`}
                      className="w-full object-cover"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </section>

      {/* ✅ Shop by Categories with same responsive padding */}
      <section className="px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28 pt-10 bg-white">
        {/* Horizontal Flex Container */}
        <div className="flex flex-col items-center justify-between gap-6 mb-6">
          {/* Title on Left */}
          <h2 className="text-xl md:text-2xl pb-8 font-semibold text-[#111] whitespace-nowrap">
            Shop By Categories
          </h2>

          {/* Category Icons on Right */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              {
                title: "Mobiles",
                image:
                  "https://res.cloudinary.com/dyiupjfwp/image/upload/v1747466437/partyworld/occasions/euxs9dgtqo5gfidweevm.png",
                link: "/shop/category/phone",
              },
              {
                title: "Tablets",
                image:
                  "https://res.cloudinary.com/dyiupjfwp/image/upload/v1747466438/partyworld/occasions/mls5ztu8moaf84krlrxp.png",
                link: "/shop/category/tablets",
              },
              {
                title: "Wearables",
                image:
                  "https://res.cloudinary.com/dyiupjfwp/image/upload/v1747466440/partyworld/occasions/sftp7fglxei4exjkfbhg.png",
                link: "/shop/category/watches",
              },
              {
                title: "Accessories",
                image:
                  "https://res.cloudinary.com/dyiupjfwp/image/upload/v1747466441/partyworld/occasions/cymedpbta6mb5koe3svq.png",
                link: "/shop/category/accessories",
              },
            ].map((cat) => (
              <a
                href={cat.link}
                key={cat.title}
                className="flex flex-col items-center group transition-transform hover:scale-[1.03]"
              >
                <div className="w-[200px] h-[200px] flex items-center justify-center mb-2">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-[100%] h-[100%] object-contain"
                  />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>


      {/* ✅ Top Offers with responsive horizontal padding */}
      <div className="px-1 sm:px-6 md:px-12 lg:px-20 xl:px-28">
        <TopOffersSlider
          title="Top Offers"
          categoryIds={["68233023e415c225f88b2902", "68233134e415c225f88b29ca"]}
          viewAllUrl="samsung-phones"
        />
      </div>

      
      <section className="px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28 pb-10 bg-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-semibold text-[#111] mb-4 md:mb-0">Shop by Brand</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:flex sm:flex-wrap sm:justify-between">
          {[
            { name: "Apple", image: "https://res.cloudinary.com/dyiupjfwp/image/upload/v1747468326/partyworld/occasions/nkxpqdflnjenqrpdfkts.png" },
            { name: "Samsung", image: "https://res.cloudinary.com/dyiupjfwp/image/upload/v1747468327/partyworld/occasions/hrqkrzt59asz9rvdd6j8.png" },
            { name: "Xiaomi", image: "https://res.cloudinary.com/dyiupjfwp/image/upload/v1747468328/partyworld/occasions/xj4te4zfhpjxmvnnswg5.png" },
            { name: "Huawei", image: "https://res.cloudinary.com/dyiupjfwp/image/upload/v1747468329/partyworld/occasions/q6el9lzemkj1c4fhny5l.png" },
            { name: "HP", image: "https://res.cloudinary.com/dyiupjfwp/image/upload/v1747468329/partyworld/occasions/xiu2vui7qvf0qwcdvep8.png" },
            { name: "Sony", image: "https://res.cloudinary.com/dyiupjfwp/image/upload/v1747468330/partyworld/occasions/onjfkljznmp0dk8oeq5b.png" },
            { name: "Anker", image: "https://res.cloudinary.com/dyiupjfwp/image/upload/v1747468330/partyworld/occasions/onjfkljznmp0dk8oeq5b.png" },
            { name: "Lenovo", image: "https://res.cloudinary.com/dyiupjfwp/image/upload/v1747468331/partyworld/occasions/renfxlxm0w4wyalouacq.png" },
            { name: "Promate", image: "https://res.cloudinary.com/dyiupjfwp/image/upload/v1747468332/partyworld/occasions/f7khnpekm3grmdznlehd.png" },
          ].map((brand) => (
            <div
              key={brand.name}
              className="w-full sm:w-[120px] h-[60px] flex items-center justify-center bg-[#f5f5f5] rounded-lg shadow-sm transition-transform hover:scale-105"
            >
              <img
                src={brand.image}
                alt={brand.name}
                className="max-h-[30px] max-w-[70px] object-contain"
              />
            </div>
          ))}
        </div>


      </section>


          <section className="w-full bg-[#fef1f1] px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28 py-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Big Box */}
              <div className=" rounded-2xl p-2 flex flex-col md:flex-row items-center justify-between">
                <div className="mb-4 md:mb-0 md:mr-6 max-w-[250px]">
                  </div>
                    <img
                      src="https://res.cloudinary.com/dyiupjfwp/image/upload/v1747469226/partyworld/occasions/nsu1watighfifkgvx11o.png"
                      alt="Mobiles"
                    />
                  </div>

                    {/* Right Grid of 4 */}
                    <div className="grid grid-cols-2 gap-2">
                      {[
                                    {
                                      title: "Power banks",
                                      image: "https://res.cloudinary.com/dyiupjfwp/image/upload/v1747469230/partyworld/occasions/gt56r61jlcf9on6agnvu.png",
                                    },
                                    {
                                      title: "Headphones & earphones",
                                      image: "https://res.cloudinary.com/dyiupjfwp/image/upload/v1747469227/partyworld/occasions/w91w2wocppw3xgonzxie.png",
                                    },
                                    {
                                      title: "Wearables",
                                      image: "https://res.cloudinary.com/dyiupjfwp/image/upload/v1747469228/partyworld/occasions/dr973hewlruanbhqe3hs.png",
                                    },
                                    {
                                      title: "Accessories",
                                      image: "https://res.cloudinary.com/dyiupjfwp/image/upload/v1747469229/partyworld/occasions/cq5o8s1b8n0ea6uejj36.png",
                                    },
                                  ].map((item) => (
                                    <div
                                key={item.title}
                                className="rounded-2xl pt-4 flex flex-col items-center transition"
                              >
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-[280px]"
                                />
                        </div>
                      ))}
              </div>
            </div>
          </section>

                {/* ✅ Top Offers with responsive horizontal padding */}
      <div className="px-1 sm:px-6 md:px-12 lg:px-20 xl:px-28">
        <TopOffersSlider
          title="Top Picks On Mobile"
          categoryIds={["68233023e415c225f88b2902", "6823305fe415c225f88b2936","682330dde415c225f88b298d", "68233134e415c225f88b29ca"]}
          viewAllUrl="samsung-phones"
        />
      </div>
            {/* ✅ Full Width Banner Section */}
            <section className="w-full bg-black text-white">
              <div className="flex flex-col md:flex-row items-center justify-between  max-w-[1600px] mx-auto">
                {/* Image Section */}

                  <img
                    src="https://res.cloudinary.com/dyiupjfwp/image/upload/v1747470368/partyworld/occasions/jzspftl9rlbcsgyc3u5v.png"
                    alt="Apple Watch"
                    className="w-full object-contain"
                  />

              </div>
            </section>
                  {/* ✅ Top Offers with responsive horizontal padding */}
      <div className="px-1 sm:px-6 md:px-12 lg:px-20 xl:px-28">
        <TopOffersSlider
          title="Top Picks On Watches"
          categoryIds={["682331aee415c225f88b2a19"]}
          viewAllUrl="samsung-phones"
        />
      </div>
            {/* ✅ Two-Banner Full Width Slider (No Arrows, No Text) */}
            <section className="w-full">
              <Swiper
                spaceBetween={0}
                slidesPerView={1}
                loop={true}
                autoplay={{ delay: 3000 }}
                modules={[Autoplay]}
                className="w-full"
              >
                {[
                  "https://res.cloudinary.com/dyiupjfwp/image/upload/v1747470795/partyworld/occasions/kwfpbfxi7jlefcemyurv.png",
                  "https://res.cloudinary.com/dyiupjfwp/image/upload/v1747470796/partyworld/occasions/kes7xekdaweol98vdzkh.png"
                ].map((src, idx) => (
                  <SwiperSlide key={idx}>
                    <img
                      src={src}
                      alt={`Promo Banner ${idx + 1}`}
                      className="w-full object-cover"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </section>
      {/* ✅ Top Offers with responsive horizontal padding */}
      <div className="px-1 sm:px-6 md:px-12 lg:px-20 xl:px-28">
        <TopOffersSlider
          title="Top Picks On Tablets"
          categoryIds={["6823312de415c225f88b29c4"]}
          viewAllUrl="samsung-phones"
        />
      </div>
            {/* ✅ Full Width Banner Section */}
            <section className="w-full bg-black text-white">
              <div className="flex flex-col md:flex-row items-center justify-between max-w-[1600px] mx-auto">
                {/* Image Section */}

                  <img
                    src="https://res.cloudinary.com/dyiupjfwp/image/upload/v1747470944/partyworld/occasions/vifgyalvepowqaw1rtwy.png"
                    alt="Apple Watch"
                    className="w-full object-contain"
                  />

              </div>
            </section>
                  {/* ✅ Top Offers with responsive horizontal padding */}
      <div className="px-1 sm:px-6 md:px-12 lg:px-20 xl:px-28">
        <TopOffersSlider
          title="Top Picks On Accessories"
          categoryIds={["6823302be415c225f88b2908"]}
          viewAllUrl="samsung-phones"
        />
      </div>
    </div>
  );
}

export default ShoppingHome;
