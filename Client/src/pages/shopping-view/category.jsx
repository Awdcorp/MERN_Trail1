// ✅ Frontend: Dynamic category page to display products
// File: Client/src/pages/shopping-view/category.jsx

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function CategoryPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");

  useEffect(() => {
    axios.get(`/api/products/category/${slug}`)
      .then(res => {
        setProducts(res.data.products);
        setCategory(res.data.category);
      })
      .catch(err => console.error("❌ Failed to fetch category products:", err));
  }, [slug]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Category: {category}</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product._id} className="border p-2 rounded shadow">
            <img
              src={product.image}
              alt={product.title}
              className="h-32 w-full object-contain"
            />
            <h3 className="text-sm mt-2 font-medium">{product.title}</h3>
            <p className="text-xs text-muted">₹{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryPage;
