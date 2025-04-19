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
} from "@/store/admin/order-slice";

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { orderList, orderDetails } = useSelector((state) => state.adminOrder);
  const dispatch = useDispatch();

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetailsForAdmin(getId));
  }

  useEffect(() => {
    dispatch(resetOrderDetails());
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  return (
    <>
      <AdminPanelTemplate
        title="All Orders"
        columns={[
          { label: "Order ID" },
          { label: "Order Date" },
          { label: "Status" },
          { label: "Total" },
          { label: "Actions", align: "right" },
        ]}
        actions={<Button disabled>Add Order</Button>}
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
            <td colSpan={5} className="text-center py-6 text-muted-foreground">
              No orders found
            </td>
          </tr>
        )}
      </AdminPanelTemplate>

      {openDetailsDialog && orderDetails && (
        <Dialog open={openDetailsDialog} onOpenChange={setOpenDetailsDialog}>
          <AdminOrderDetailsView
            orderDetails={orderDetails}
            setOpen={setOpenDetailsDialog}
          />
        </Dialog>
      )}
    </>
  );
}

export default AdminOrdersView;
