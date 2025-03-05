import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  orderList: [],
  orderDetails: null,
};

export const getAllOrdersForAdmin = createAsyncThunk(
  "/order/getAllOrdersForAdmin",
  async () => {
    console.log("Fetching orders from backend...");
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/admin/orders/get`
    );
    console.log("Orders received from backend:", response.data);
    return response.data;
  }
);

export const getOrderDetailsForAdmin = createAsyncThunk(
  "/order/getOrderDetailsForAdmin",
  async (id) => {
    console.log(`Fetching order details from API: ${id}`);
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/admin/orders/details/${id}`
    );
    console.log("Order details received:", response.data);
    return response.data;
  }
);

export const updateOrderStatus = createAsyncThunk(
  "/order/updateOrderStatus",
  async ({ id, orderStatus }) => {
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/admin/orders/update/${id}`,
      {
        orderStatus,
      }
    );

    return response.data;
  }
);

const adminOrderSlice = createSlice({
  name: "adminOrderSlice",
  initialState: {
    orderList: [], // ✅ Ensure this updates properly
    orderDetails: null,
    isLoading: false,
  },
  reducers: {
    resetOrderDetails: (state) => {
      console.log("Resetting order details...");
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(getAllOrdersForAdmin.fulfilled, (state, action) => {
      console.log("Updating Redux state with orders:", action.payload.data);
      state.orderList = action.payload.data || [];
    })
    .addCase(getOrderDetailsForAdmin.fulfilled, (state, action) => {
      console.log("Updating Redux state with order details:", action.payload.data);
      state.orderDetails = action.payload.data?.data || null; // ✅ Ensure Redux updates orderDetails
    })
    .addCase(getOrderDetailsForAdmin.rejected, (state) => {
      console.log("Failed to fetch order details...");
      state.orderDetails = null;
    });
  },
});

export const { resetOrderDetails } = adminOrderSlice.actions;

export default adminOrderSlice.reducer;
