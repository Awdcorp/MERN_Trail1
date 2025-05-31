import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import AdminPanelTemplate from "./AdminPanelTemplate";
import AdminOrderDetailsView from "./order-details";
import AdminOrderRow from "./order-tile";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
  createOrder,
} from "@/store/admin/order-slice";

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [isNewOrder, setIsNewOrder] = useState(false);
  const { orderList, orderDetails } = useSelector((state) => state.adminOrder);
  const dispatch = useDispatch();

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetailsForAdmin(getId));
    setIsNewOrder(false);
  }

  useEffect(() => {
    dispatch(resetOrderDetails());
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null && !openDetailsDialog) {
      setOpenDetailsDialog(true);
    }
  }, [orderDetails]);

  function handleCreateNewOrder() {
    dispatch(resetOrderDetails());
    setIsNewOrder(true);
    setOpenDetailsDialog(true);
  }

  return (
    <>
      <AdminPanelTemplate
        title="All Orders"
        columns={[
          { label: "Order ID" },
          { label: "Customer" },
          { label: "Order Status" },
          { label: "Payment Method" },
          { label: "Payment Status" },
          { label: "Total" },
          { label: "Date" },
          { label: "Actions", align: "right" },
        ]}
        actions={<Button onClick={handleCreateNewOrder}>Add Order</Button>}
      >
        {Array.isArray(orderList) && orderList.length > 0 ? (
          orderList.map((order) => (
            <AdminOrderRow
              key={order._id}
              order={order}
              onView={() => handleFetchOrderDetails(order._id)}
            />
          ))
        ) : (
          <tr>
            <td colSpan={6} className="text-center py-6 text-muted-foreground">
              No orders found
            </td>
          </tr>
        )}
      </AdminPanelTemplate>

      {openDetailsDialog && (
        <Dialog open={openDetailsDialog} onOpenChange={setOpenDetailsDialog}>
          <AdminOrderDetailsView
            orderDetails={isNewOrder ? {} : orderDetails}
            setOpen={setOpenDetailsDialog}
            isNewOrder={isNewOrder}
          />
        </Dialog>
      )}
    </>
  );
}

export default AdminOrdersView;
