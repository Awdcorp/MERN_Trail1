import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { fetchAllFilteredProducts, fetchProductDetails } from "@/store/shop/products-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import OccasionCategorySection from "@/components/shopping-view/CategorySection";
import CategorySection  from "@/components/shopping-view/CategorySection";
import ProductSliderSection from "@/components/shopping-view/ProductSliderSection";
import HomepageSlider from "@/components/shopping-view/homepageslider";
import ThemeCategorySection from "@/components/shopping-view/themecategorysection";
import { PhoneCall } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import axios from "axios";
import { getGuestId } from "@/lib/guest-id";
import { Helmet } from "react-helmet";

function ShoppingHome() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productDetails } = useSelector((state) => state.shopProducts);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [seo, setSeo] = useState({
    metaTitle: "PartyWorld | Party Supplies in UAE",
    metaDescription: "Shop party decorations, costumes, and accessories for every occasion.",
    ogImage: "https://partyworld.ae/wp-content/uploads/2025/03/children-celebrating-birthday-party-scaled-1.jpg",
    organization: {
      name: "PartyWorld UAE",
      url: "https://partyworld.ae",
      logo: "https://partyworld.ae/wp-content/uploads/2025/03/logo.png",
    },
  });

  const [homepageSections, setHomepageSections] = useState([]);

  useEffect(() => {
    const fetchSEO = async () => {
      try {
        console.log("📡 Fetching homepage SEO...");
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/settings`);
        const homepageSeo = res.data?.homepageSeo || {};
        const organization = res.data?.organization || {};

        setSeo((prev) => ({
          metaTitle: homepageSeo.metaTitle?.trim() || prev.metaTitle,
          metaDescription: homepageSeo.metaDescription?.trim() || prev.metaDescription,
          ogImage: homepageSeo.ogImage?.trim() || prev.ogImage,
          organization: {
            name: organization.name?.trim() || prev.organization.name,
            url: organization.url?.trim() || prev.organization.url,
            logo: organization.logo?.trim() || prev.organization.logo,
          },
        }));

        console.log("✅ Final SEO values used:", res.data);
      } catch (err) {
        console.warn("⚠️ Failed to load homepage SEO. Using defaults.");
      }
    };

    fetchSEO();
  }, []);

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const fetchLayout = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/homepage-layout`);
        console.log("📦 Homepage layout loaded:", res.data);
        setHomepageSections(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch homepage layout", err);
      }
    };
    fetchLayout();
  }, []);

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

const renderSection = (section, index) => {
  switch (section.type) {
    case "slider":
      return <div key={index} className="-mx-8"><HomepageSlider {...section.data} /></div>;

    case "product-slider":
      return <ProductSliderSection key={index} {...section.data} />;

    case "category-grid":
      return <CategorySection key={index} {...section.data} />;

    case "theme-grid":
      return <ThemeCategorySection key={index} {...section.data} />;

    case "party-packages":
      return (
        <div key={index} className="px-4 md:px-8 mt-10">
          <h2 className="text-2xl font-medium text-center mb-2 uppercase text-[#463970]">Party PACKAGES</h2>
          <div className="w-[140px] h-[1.9px] bg-[#A3A3A399] mx-auto mb-10" />
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {(section.data?.packages || []).map((item, idx) => (
              <a key={idx} href={`/shop/product/${item.link}`} className="flex flex-col items-center justify-center">
                <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded-md mb-4" />
                <span className="text-sm text-center" style={{ color: "#463970", fontSize: "15px", fontWeight: 400 }}>
                  {item.name}
                </span>
              </a>
            ))}
          </div>
        </div>
      );

    case "store-locations":
      return (
        <div key={index} className="px-4 md:px-8 mt-10">
          <h2 className="text-2xl font-medium text-center mb-2 pt-5 uppercase text-[#463970]">Visit Our Stores</h2>
          <div className="w-[140px] h-[1.9px] bg-[#A3A3A399] mx-auto mb-10" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(section.data?.stores || []).map((store, idx) => (
              <div key={idx} className="relative overflow-hidden rounded-xl shadow-md text-center text-[#2D2D2D]">
                <div className={`absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t ${store.color} to-transparent z-0`} />
                <div className="relative z-10 p-4 flex flex-col items-center">
                  <div className="text-white text-xs font-semibold tracking-widest uppercase h-10 w-44 flex items-center justify-center rounded-md mx-auto" style={{ backgroundColor: store.buttonColor }}>
                    {store.name}
                  </div>
                  <h3 className="text-center text-[14px] font-medium leading-snug mb-1 pt-5 max-w-[80%] mx-auto px-2">{store.address}</h3>
                  <div className="w-[100%] h-[1px] bg-black my-3" />
                  <iframe
                    src={store.mapSrc}
                    width="100%"
                    height="230"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={store.name}
                    className="rounded-md"
                  ></iframe>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "contact-info":
      return (
        <div key={index} className="px-4 pt-10 md:px-8 py-10 bg-white text-center">
          <div className="flex flex-col pt-10 md:flex-row justify-center items-center gap-10 md:gap-20 mb-10">
            {(section.data?.phones || []).map((phone, i) => (
              <div key={i} className="flex items-center gap-3 text-xl text-[#2D2D2D]">
                <PhoneCall size={28} className="text-[#463970]" />
                <span>{phone}</span>
              </div>
            ))}
            {(section.data?.whatsapp || []).map((wa, i) => (
              <div key={i} className="flex items-center gap-3 text-xl text-[#2D2D2D]">
                <FaWhatsapp size={28} className={`text-white p-1 rounded ${i % 2 === 0 ? 'text-[#25D366]' : 'bg-[#463970]'}`} />
                <span>{wa}</span>
              </div>
            ))}
          </div>
          {section.data?.buttonText && (
            <a href={section.data.buttonLink || "#"}>
              <button className="bg-[#463970] text-white px-6 py-2 rounded-full text-sm shadow-md hover:opacity-90 transition">
                {section.data.buttonText}
              </button>
            </a>
          )}
        </div>
      );

    default:
      return null;
  }
};
 

  return (
    <div className="pt-0 pb-6 md:pb-10 px-4 md:px-6 space-y-6 md:space-y-10">
      <Helmet>
        <title>{seo.metaTitle}</title>
        <meta name="description" content={seo.metaDescription} />
        <meta property="og:title" content={seo.metaTitle} />
        <meta property="og:description" content={seo.metaDescription} />
        <meta property="og:image" content={seo.ogImage} />
        <link rel="canonical" href="https://partyworld.ae/" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: seo.organization.name,
            url: seo.organization.url,
            logo: seo.organization.logo,
          })}
        </script>
      </Helmet>

      {homepageSections.map((section, index) => renderSection(section, index))}
    </div>
  );
}

export default ShoppingHome;