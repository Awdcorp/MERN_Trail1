import { useEffect, useState } from "react";
import axios from "axios";
import DemoProductTile from "@/components/shopping-view/demoProductTile";
const PROMATE_PRODUCT_IDS = [
  "68230867caeba90f1f34663f",
  "68230868caeba90f1f346640",
  "6823086acaeba90f1f346641",
  "6823086bcaeba90f1f346642",
  "6823086dcaeba90f1f346644",
];

export default function PromateShowcaseSection() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
axios
  .get(`${import.meta.env.VITE_API_URL}/api/products/by-ids`, {
    params: { ids: PROMATE_PRODUCT_IDS.join(",") },
  })
      .then((res) => {
        console.log("📦 Promate products response:", res.data);
        setProducts(res.data.products || []);
      })
      .catch((err) => {
        console.error("Failed to load Promate products", err);
      });
  }, []);

  return (
    <div className="w-full py-10">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-xl md:text-2xl font-medium text-center mb-2 uppercase text-[#463970]">
          Promate Smart Essentials
        </h2>
        <div className="w-[100px] h-[2px] bg-[#A3A3A399] mx-auto mb-6" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((productItem) => (
            <DemoProductTile
              key={productItem._id}
              product={productItem}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
