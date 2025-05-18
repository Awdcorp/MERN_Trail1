import { useEffect, useState } from "react";
import axios from "axios";
import DemoProductTile from "@/components/shopping-view/DemoProductTile";

const PROMATE_PRODUCT_IDS = [
  "68233059caeba90f1f3477d6",
  "682330bdcaeba90f1f347821",
  "682330bccaeba90f1f347820",
  "682330b4caeba90f1f34781b",
  "682330accaeba90f1f347816",
];

export default function PromateShowcaseSection() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
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
    <div className="w-full py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-xl md:text-2xl font-semibold text-center mb-2 uppercase text-[#1f2937]">
          Promate Smart Essentials
        </h2>
        <div className="w-[100px] h-[2px] bg-[#a5b4fc] mx-auto mb-6" />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((productItem) => (
            <DemoProductTile key={productItem._id} product={productItem} />
          ))}
        </div>
      </div>
    </div>
  );
}
