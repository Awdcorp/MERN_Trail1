import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductListView = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_WC_API}/products`, {
          auth: {
            username: import.meta.env.VITE_WC_KEY,
            password: import.meta.env.VITE_WC_SECRET,
          },
        });
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (err) {
        console.error("❌ API Fetch Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle search filtering
  useEffect(() => {
    setFilteredProducts(
      products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, products]);

  if (loading) return <p className="text-center text-gray-600">Loading products...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-lg font-bold mb-4">Product Management</h2>
      
      {/* 🔍 Search Bar */}
      <input
        type="text"
        placeholder="Search products..."
        className="w-full p-2 border border-gray-300 rounded mb-4"
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* 📊 Product Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border border-gray-300">Image</th>
              <th className="p-2 border border-gray-300">Product Name</th>
              <th className="p-2 border border-gray-300">Price</th>
              <th className="p-2 border border-gray-300">Stock</th>
              <th className="p-2 border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className="text-center">
                <td className="p-2 border border-gray-300">
                  <img src={product.images?.[0]?.src} alt={product.name} className="w-12 h-12 mx-auto" />
                </td>
                <td className="p-2 border border-gray-300">{product.name}</td>
                <td className="p-2 border border-gray-300">${product.price}</td>
                <td className="p-2 border border-gray-300">{product.stock_quantity ?? "N/A"}</td>
                <td className="p-2 border border-gray-300">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded mr-2">Edit</button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductListView;
