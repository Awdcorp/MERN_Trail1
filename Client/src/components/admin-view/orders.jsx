import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import AdminOrderDetailsView from "./order-details";
import { Badge } from "../ui/badge";
import axios from "axios";

// Use environment variables for WooCommerce API
const API_URL = `${import.meta.env.VITE_WC_API}/orders`;
const CONSUMER_KEY = import.meta.env.VITE_WC_KEY;
const CONSUMER_SECRET = import.meta.env.VITE_WC_SECRET;

function AdminOrdersView() {
  const [orderList, setOrderList] = useState([]);
  const [orderDetails, setOrderDetails] = useState(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  // Fetch Orders from WooCommerce API
  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await axios.get(API_URL, {
          auth: {
            username: CONSUMER_KEY,
            password: CONSUMER_SECRET,
          },
        });

        console.log("WooCommerce Orders API Response:", response.data); // Debugging log
        setOrderList(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    }
    fetchOrders();
  }, []);

  // Fetch Order Details
  async function handleFetchOrderDetails(orderId) {
    try {
      const response = await axios.get(`${API_URL}/${orderId}`, {
        auth: {
          username: CONSUMER_KEY,
          password: CONSUMER_SECRET,
        },
      });

      console.log("WooCommerce Order Details API Response:", response.data); // Debugging log
      setOrderDetails(response.data);
      setOpenDetailsDialog(true);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Total</TableHead>
              <TableHead>
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList.length > 0 ? (
              orderList.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{new Date(order.date_created).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge>{order.status}</Badge>
                  </TableCell>
                  <TableCell>${order.total}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleFetchOrderDetails(order.id)}>View</Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan="5">No orders found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      {/* Order Details Dialog */}
      {orderDetails && (
        <Dialog open={openDetailsDialog} onOpenChange={setOpenDetailsDialog}>
          <AdminOrderDetailsView orderDetails={orderDetails} />
        </Dialog>
      )}
    </Card>
  );
}

export default AdminOrdersView;
