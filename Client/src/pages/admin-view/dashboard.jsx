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
  const [stats, setStats] = useState({});
  const [salesData, setSalesData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/admin/dashboard-stats`)
      .then(res => setStats(res.data));

    axios.get(`${import.meta.env.VITE_API_URL}/api/admin/sales-chart`)
      .then(res => setSalesData(res.data));

    axios.get(`${import.meta.env.VITE_API_URL}/api/admin/recent-orders`)
      .then(res => setRecentOrders(res.data));
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
    <div className="px-4 pt-6 space-y-6">
      {/* Total Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Orders" value={stats.totalOrders} Icon={ShoppingCart} />
        <StatCard title="Total Sales" value={`${stats.sales?.toLocaleString?.() || "0"} د.إ`} Icon={DollarSign} />
        <StatCard title="Total Products" value={stats.products} Icon={Boxes} />
        <StatCard title="Total Users" value={stats.users} Icon={UsersIcon} />
      </div>

      {/* Order Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Pending Orders" value={stats.pendingOrders} Icon={ShoppingCart} />
        <StatCard title="Completed Orders" value={stats.completedOrders} Icon={ShoppingCart} />
        <StatCard title="Refunded Orders" value={stats.refundOrders} Icon={ShoppingCart} />
      </div>

      {/* Product Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Products" value={stats.activeProducts} Icon={Boxes} />
        <StatCard title="Draft Products" value={stats.draftProducts} Icon={Boxes} />
        <StatCard title="Low Stock Products" value={stats.lowStockProducts} Icon={Boxes} />
      </div>

      {/* User & Performance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="New Users This Week" value={stats.newUsersThisWeek} Icon={UsersIcon} />
        <StatCard title="Avg Order Value" value={`${stats.avgOrderValue} د.إ`} Icon={DollarSign} />
        <StatCard title="Refund Rate" value={`${stats.refundRate}%`} Icon={DollarSign} />
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
              <BarChart
                data={Array.isArray(salesData) ? salesData : []}
                margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                barSize={30}
              >
                <XAxis
                  dataKey="month"
                  stroke="#888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888"
                  fontSize={12}
                  tickFormatter={(value) => `د.إ ${value}`}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(value) => [`د.إ ${value.toLocaleString?.()}`, "Sales"]}
                  contentStyle={{ fontSize: "12px" }}
                />
                <Bar dataKey="amount" fill="#4f46e5" radius={[6, 6, 0, 0]} />
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
                    <tr
                      key={order._id}
                      className="border-b hover:shadow-sm transition duration-150 hover:bg-gray-50"
                    >
                      <td className="py-2 text-gray-700 font-mono">{order._id.slice(-6)}</td>
                      <td className="py-2 flex items-center gap-2 font-medium text-gray-800">
                        <div className="w-6 h-6 rounded-full bg-gray-200 text-xs font-semibold flex items-center justify-center">
                          {(order.customerName || "G")[0]}
                        </div>
                        {order.customerName || "Guest"}
                      </td>
                      <td className="py-2 text-left text-gray-900 font-semibold tracking-wide">
                        د.إ {order.total?.toLocaleString?.()}
                      </td>
                      <td className="py-2">
                        <span
                          className={`px-2 py-1 text-xs rounded-full font-semibold ${
                            order.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : order.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : order.status === "failed"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
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
