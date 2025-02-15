import React, { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from "chart.js";
import axios from "axios";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const Analytics = () => {
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [dateRange, setDateRange] = useState("week"); // Default to last week

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        // Fetching Sales Data from WooCommerce API with date filter
        const salesResponse = await axios.get(`${import.meta.env.VITE_WC_API}/reports/sales?period=${dateRange}`, {
          auth: {
            username: import.meta.env.VITE_WC_KEY,
            password: import.meta.env.VITE_WC_SECRET,
          },
        });
        
        // Fetching Top Selling Products
        const productsResponse = await axios.get(`${import.meta.env.VITE_WC_API}/reports/top_sellers`, {
          auth: {
            username: import.meta.env.VITE_WC_KEY,
            password: import.meta.env.VITE_WC_SECRET,
          },
        });
        
        console.log("Sales Data:", salesResponse.data);
        console.log("Top Selling Products:", productsResponse.data);
        
        setSalesData(salesResponse.data);
        setTopProducts(productsResponse.data);
      } catch (error) {
        console.error("Error fetching WooCommerce analytics data:", error);
      }
    };

    fetchAnalyticsData();
  }, [dateRange]);

  // Ensure salesData is correctly extracted
  const salesTotals = salesData.length > 0 ? salesData[0].totals : {};
  console.log("Extracted Sales Totals:", salesTotals);
  
  const salesLabels = salesTotals ? Object.keys(salesTotals) : [];
  console.log("Extracted Sales Labels:", salesLabels);
  
  const salesValues = salesLabels.map(date => {
    const salesEntry = salesTotals[date]; 
    console.log("Sales Entry for", date, ":", salesEntry);
    return salesEntry && salesEntry.sales ? Number(salesEntry.sales) : 0;
  });

  console.log("Extracted Sales Values:", salesValues);

  const salesChartData = {
    labels: [...salesLabels],  // Ensure labels are correctly passed
    datasets: [
      {
        label: "Total Sales ($)",
        data: [...salesValues], // Ensure values are correctly passed
        borderColor: "#2563EB",
        backgroundColor: "rgba(37, 99, 235, 0.2)",
        fill: true,
      },
    ],
  };

  const productChartData = {
    labels: topProducts.length > 0 ? topProducts.map(product => product.name || "Unknown Product") : [],
    datasets: [
      {
        label: "Units Sold",
        data: topProducts.length > 0 ? topProducts.map(product => parseInt(product.total_sold, 10)) : [],
        backgroundColor: ["#F87171", "#34D399", "#60A5FA", "#FBBF24", "#A78BFA"],
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">📊 Sales & Analytics</h1>

      {/* Date Range Selector */}
      <div className="mb-4">
        <label className="mr-2 font-semibold">Select Date Range:</label>
        <select
          className="p-2 border rounded"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
        >
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      <div className="bg-white p-4 rounded shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-3">📈 Sales Trends (Filtered by {dateRange})</h2>
        {salesValues.length > 0 ? <Line key={dateRange} data={salesChartData} /> : <p>No sales data available</p>}
      </div>

      <div className="bg-white p-4 rounded shadow-md">
        <h2 className="text-lg font-semibold mb-3">🔥 Best-Selling Products</h2>
        {productChartData.labels.length > 0 ? <Bar data={productChartData} /> : <p>No product sales data available</p>}
      </div>
    </div>
  );
};

export default Analytics;
