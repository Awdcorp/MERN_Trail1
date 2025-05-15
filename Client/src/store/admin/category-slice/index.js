// File: src/store/admin/category-slice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/admin/categories`;

// Fetch all categories with pagination
export const fetchAllCategories = createAsyncThunk(
  "adminCategories/fetchAll",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
        console.log("📤 Fetching categories: page =", page, "limit =", limit);
      const res = await axios.get(API_URL, { params: { page, limit } });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Failed to fetch categories");
    }
  }
);

export const addCategory = createAsyncThunk(
  "adminCategories/add",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(API_URL, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Failed to add category");
    }
  }
);

export const updateCategory = createAsyncThunk(
  "adminCategories/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Failed to update category");
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "adminCategories/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Failed to delete category");
    }
  }
);

export const bulkDeleteCategories = createAsyncThunk(
  "adminCategories/bulkDelete",
  async (ids, { rejectWithValue }) => {
    try {
      await axios.delete(API_URL, { data: { ids } });
      return ids;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Failed to bulk delete");
    }
  }
);

const categorySlice = createSlice({
  name: "adminCategories",
  initialState: {
    items: [],
    total: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.items = action.payload.categories;
        state.total = action.payload.total;
        state.loading = false;
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.items.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c._id !== action.payload);
      })
      .addCase(bulkDeleteCategories.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => !action.payload.includes(c._id));
      });
  },
});

export default categorySlice.reducer;
