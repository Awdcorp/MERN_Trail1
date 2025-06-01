import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ✅ Load coupon from localStorage if available
const storedCoupon = localStorage.getItem("applied_coupon");

const initialState = {
  cartItems: [],
  appliedCoupon: storedCoupon ? JSON.parse(storedCoupon) : null,
  isLoading: false,
};

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, guestId, productId, quantity }) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/shop/cart/add`,
      {
        userId,
        guestId,
        productId,
        quantity,
      }
    );
    return response.data;
  }
);

export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (id) => {
    if (!id) throw new Error("🛑 Missing ID in fetchCartItems");
    console.log("🛒 [Redux] fetchCartItems called with ID:", id);
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/shop/cart/get/${id}`
    );
    return response.data;
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ userId, guestId, productId }) => {
    const query = userId ? `userId=${userId}` : `guestId=${guestId}`;
    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/shop/cart/${productId}?${query}`
    );
    return response.data;
  }
);

export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ userId, guestId, productId, quantity }) => {
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/shop/cart/update-cart`,
      {
        userId,
        guestId,
        productId,
        quantity,
      }
    );
    return response.data;
  }
);

export const migrateGuestCartToUser = createAsyncThunk(
  "cart/migrateGuestCartToUser",
  async ({ guestId, userId }) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/shop/cart/migrate-to-user`,
      { guestId, userId }
    );
    return response.data;
  }
);

const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {
    applyCouponToCart(state, action) {
      state.appliedCoupon = action.payload;
      localStorage.setItem("applied_coupon", JSON.stringify(action.payload)); // ✅ persist
    },
    removeCouponFromCart(state) {
      state.appliedCoupon = null;
      localStorage.removeItem("applied_coupon"); // ✅ clear
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data?.items || [];
      })
      .addCase(addToCart.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data?.items || [];
      })
      .addCase(fetchCartItems.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(updateCartQuantity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data?.items || [];
      })
      .addCase(updateCartQuantity.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data?.items || [];
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.isLoading = false;
        console.warn("❌ Delete failed:", action?.error?.message);
      });
  },
});

export const { applyCouponToCart, removeCouponFromCart } = shoppingCartSlice.actions;
export default shoppingCartSlice.reducer;
