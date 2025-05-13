import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
};

// 🔁 Bulk update multiple products
export const bulkUpdateProducts = createAsyncThunk(
  "adminProducts/bulkUpdate",
  async ({ ids, updates }, thunkAPI) => {
    try {
      const res = await axios.patch(`${import.meta.env.VITE_API_URL}/api/admin/products/bulk-update`, { ids, updates });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || { message: "Bulk update failed" });
    }
  }
);

// 🔁 Bulk delete multiple products
export const bulkDeleteProducts = createAsyncThunk(
  "adminProducts/bulkDelete",
  async ({ ids }, thunkAPI) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/products/bulk-delete`, { ids });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || { message: "Bulk delete failed" });
    }
  }
);
export const addNewProduct = createAsyncThunk(
  "/products/addnewproduct",
  async (formData) => {
    const result = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/admin/products/add`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return result?.data;
  }
);

export const fetchAllProducts = createAsyncThunk(
  "adminProducts/fetchAllProducts",
  async ({ page = 1, limit = 10, search = "", category, sortBy, sortOrder }, thunkAPI) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/products/get`, {
        params: { page, limit, search, category, sortBy, sortOrder }, // ✅ make sure this is present
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);


export const editProduct = createAsyncThunk(
  "/products/editProduct",
  async ({ id, formData }) => {
    const result = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/admin/products/edit/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return result?.data;
  }
);

export const deleteProduct = createAsyncThunk(
  "/products/deleteProduct",
  async (id) => {
    const result = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/admin/products/delete/${id}`
    );

    return result?.data;
  }
);

const AdminProductsSlice = createSlice({
  name: "adminProducts",
  initialState: {
    productList: [],
    total: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.productList = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch products";
      });
  },
});

export default AdminProductsSlice.reducer;
