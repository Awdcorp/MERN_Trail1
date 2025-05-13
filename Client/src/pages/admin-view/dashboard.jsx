import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  DollarSign,
  ShoppingCart,
  Boxes,
  Users as UsersIcon
} from "lucide-react";

function AdminDashboard() {
  const [stats, setStats] = useState({ orders: 0, sales: 0, products: 0, users: 0 });
  const [salesData, setSalesData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/admin/dashboard-stats`)
      .then(res => setStats(res.data));

    axios.get(`${import.meta.env.VITE_API_URL}/api/admin/sales-chart`)
      .then(res => {
        console.log("📊 salesChartData:", res.data);
        setSalesData(res.data);
      });

    axios.get(`${import.meta.env.VITE_API_URL}/api/admin/recent-orders`)
      .then(res => {
        console.log("📦 recentOrders API res:", res.data);
        setRecentOrders(res.data);
      });
  }, []);

  const StatCard = ({ title, value, Icon }) => (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-4 space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Orders" value={stats.totalOrders} Icon={ShoppingCart} />
        <StatCard title="Total Sales" value={`₹${stats.sales?.toLocaleString?.() || "0"}`} Icon={DollarSign} />
        <StatCard title="Total Products" value={stats.products} Icon={Boxes} />
        <StatCard title="Total Users" value={stats.users} Icon={UsersIcon} />
      </div>

      {/* Chart and Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-700">Sales Overview</CardTitle>
            <p className="text-sm text-muted-foreground">Revenue by month</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={Array.isArray(salesData) ? salesData : []}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-700">Recent Orders</CardTitle>
            <p className="text-sm text-muted-foreground">Last few transactions</p>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(recentOrders) &&
                  recentOrders.map(order => (
                    <tr key={order._id} className="border-b hover:bg-gray-50">
                      <td>{order._id.slice(-6)}</td>
                      <td>{order.customerName || "Guest"}</td>
                      <td>₹{order.total}</td>
                      <td>
                        <span
                          className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${
                            order.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : order.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status || "-"}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AdminDashboard;