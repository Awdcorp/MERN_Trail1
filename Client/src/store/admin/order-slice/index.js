import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  orderList: [],
  orderDetails: null,
};

export const createOrder = createAsyncThunk(
  "adminOrder/createOrder",
  async (newOrderData, { rejectWithValue }) => {
    try {
      console.log("📤 Creating order with:", newOrderData);
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/orders/create`, newOrderData);
      console.log("✅ Order creation success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ Order creation failed:", err?.response?.data || err);
      return rejectWithValue(err?.response?.data || { message: "Create order failed" });
    }
  }
);

export const getAllOrdersForAdmin = createAsyncThunk(
  "/order/getAllOrdersForAdmin",
  async (_, { rejectWithValue }) => {
    try {
      console.log("📤 Fetching all admin orders...");
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/orders/get`);
      console.log("✅ Admin orders fetched:", response.data);
      return response.data;
    } catch (err) {
      console.error("❌ Failed to fetch orders:", err?.response?.data || err);
      return rejectWithValue(err?.response?.data || { message: "Fetch failed" });
    }
  }
);

export const getOrderDetailsForAdmin = createAsyncThunk(
  "/order/getOrderDetailsForAdmin",
  async (id, { rejectWithValue }) => {
    try {
      console.log("📤 Fetching details for order ID:", id);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/orders/details/${id}`);
      console.log("✅ Order details received:", response.data);
      return response.data;
    } catch (err) {
      console.error("❌ Order detail fetch failed:", err?.response?.data || err);
      return rejectWithValue(err?.response?.data || { message: "Details fetch failed" });
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "/order/updateOrderStatus",
  async ({ id, orderStatus, paymentStatus, paymentMethod, addressInfo, customer_name, cartItems }, { rejectWithValue }) => {
    const payload = {
      ...(orderStatus && { orderStatus }),
      ...(paymentStatus && { paymentStatus }),
      ...(paymentMethod && { paymentMethod }),
      ...(addressInfo && Object.keys(addressInfo).length > 0 && { addressInfo }),
      ...(customer_name && customer_name.trim() && { customer_name }),
      ...(cartItems && cartItems.length > 0 && { cartItems }),
    };

    try {
      console.log("🔄 Updating order ID:", id, "with payload:", payload);
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/orders/update/${id}`, payload);
      console.log("✅ Order update success:", response.data);
      return response.data;
    } catch (err) {
      console.error("❌ Order update failed:", err?.response?.data || err);
      return rejectWithValue(err?.response?.data || { message: "Update failed" });
    }
  }
);

export const initiateRefund = createAsyncThunk(
  "adminOrder/initiateRefund",
  async ({ orderId, refundAmount, refundReason, restockItems }, { rejectWithValue }) => {
    try {
      console.log("📤 Initiating refund with:", { orderId, refundAmount, refundReason, restockItems });
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/orders/refund`, {
        orderId,
        refundAmount,
        refundReason,
        restockItems,
      });
      console.log("✅ Refund response:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ Refund failed:", err?.response?.data || err);
      return rejectWithValue(err?.response?.data || { message: "Refund failed" });
    }
  }
);

const adminOrderSlice = createSlice({
  name: "adminOrderSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      console.log("♻️ Resetting order details");
      state.orderDetails = null;
    },
    orderDetailsUpdated: (state, action) => {
      console.log("📝 Manually updated orderDetails:", action.payload);
      state.orderDetails = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrdersForAdmin.pending, (state) => {
        console.log("⏳ getAllOrdersForAdmin.pending");
        state.isLoading = true;
      })
      .addCase(getAllOrdersForAdmin.fulfilled, (state, action) => {
        console.log("✅ getAllOrdersForAdmin.fulfilled");
        state.isLoading = false;
        state.orderList = action.payload.data;
      })
      .addCase(getAllOrdersForAdmin.rejected, (state, action) => {
        console.error("❌ getAllOrdersForAdmin.rejected:", action.payload);
        state.isLoading = false;
        state.orderList = [];
      })

      .addCase(getOrderDetailsForAdmin.pending, (state) => {
        console.log("⏳ getOrderDetailsForAdmin.pending");
        state.isLoading = true;
      })
      .addCase(getOrderDetailsForAdmin.fulfilled, (state, action) => {
        console.log("✅ getOrderDetailsForAdmin.fulfilled");
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(getOrderDetailsForAdmin.rejected, (state, action) => {
        console.error("❌ getOrderDetailsForAdmin.rejected:", action.payload);
        state.isLoading = false;
        state.orderDetails = null;
      })

      .addCase(initiateRefund.fulfilled, (state, action) => {
        console.log("✅ Refund fulfilled. Updated order details stored.");
        state.orderDetails = action.payload.data;
      })

      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        console.log("✅ updateOrderStatus.fulfilled with:", action.payload);
      });
  },
});

export const { resetOrderDetails, orderDetailsUpdated } = adminOrderSlice.actions;
export default adminOrderSlice.reducer;
