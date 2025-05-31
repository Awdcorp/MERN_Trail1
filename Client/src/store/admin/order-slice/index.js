import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  orderList: [],
  orderDetails: null,
};

export const getAllOrdersForAdmin = createAsyncThunk(
  "/order/getAllOrdersForAdmin",
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/admin/orders/get`
    );
    return response.data;
  }
);

export const getOrderDetailsForAdmin = createAsyncThunk(
  "/order/getOrderDetailsForAdmin",
  async (id) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/admin/orders/details/${id}`
    );
    return response.data;
  }
);

export const updateOrderStatus = createAsyncThunk(
  "/order/updateOrderStatus",
  async ({ id, orderStatus, paymentStatus, paymentMethod, addressInfo, customer_name, cartItems }) => {
    const payload = {
      ...(orderStatus && { orderStatus }),
      ...(paymentStatus && { paymentStatus }),
      ...(paymentMethod && { paymentMethod }),
      ...(addressInfo && Object.keys(addressInfo).length > 0 && { addressInfo }),
      ...(customer_name && customer_name.trim() && { customer_name }),
      ...(cartItems && cartItems.length > 0 && { cartItems }),
    };

    console.log("🔄 Sending order update payload:", { id, ...payload });

    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/admin/orders/update/${id}`,
      payload
    );

    console.log("✅ Server responded:", response.data);
    return response.data;
  }
);

export const initiateRefund = createAsyncThunk(
  "adminOrder/initiateRefund",
  async ({ orderId, refundAmount, refundReason, restockItems }) => {
    console.log("📤 Initiating refund request with:", {
      orderId,
      refundAmount,
      refundReason,
      restockItems,
    });

    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/orders/refund`, {
      orderId,
      refundAmount,
      refundReason,
      restockItems,
    });

    console.log("✅ Refund API response:", res.data);
    return res.data;
  }
);


const adminOrderSlice = createSlice({
  name: "adminOrderSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
    orderDetailsUpdated: (state, action) => {
      state.orderDetails = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrdersForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
      })
      .addCase(getAllOrdersForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })
      .addCase(getOrderDetailsForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetailsForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(getOrderDetailsForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      })
      .addCase(initiateRefund.fulfilled, (state, action) => {
        state.orderDetails = action.payload.data;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        console.log("🎯 Redux thunk fulfilled with:", action.payload);
      });
  },
});

export const { resetOrderDetails, orderDetailsUpdated } = adminOrderSlice.actions;

export default adminOrderSlice.reducer;
