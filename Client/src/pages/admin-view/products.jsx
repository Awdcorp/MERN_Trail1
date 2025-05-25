// File: src/pages/admin-view/AdminProducts.jsx

import { Fragment, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { addProductFormElements } from "@/config";
import CommonForm from "@/components/common/form";
import ProductImageUpload from "@/components/admin-view/image-upload";
import DataTable from "@/components/admin-view/data-table";
import { productColumns } from "@/components/admin-view/columns";
import CategorySelector from "@/components/admin-view/CategorySelector";

import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";

const initialFormData = {
  image: "",
  title: "",
  description: "",
  categories: [],
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
};

function flattenCategories(tree) {
  let result = [];
  for (const cat of tree) {
    result.push({ _id: cat._id, name: cat.name });
    if (cat.children?.length) {
      result = result.concat(flattenCategories(cat.children));
    }
  }
  return result;
}

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [allCategories, setAllCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const { productList, total } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();
    const updatedFormData = {
      ...formData,
      image: uploadedImageUrl || formData.image || "",
    };

    currentEditedId !== null
      ? dispatch(editProduct({ id: currentEditedId, formData: updatedFormData })).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts({ page, limit, search: searchTerm, category: selectedCategory, sortBy, sortOrder }));
            resetForm();
            toast({ title: "Product updated successfully" });
          }
        })
      : dispatch(addNewProduct(updatedFormData)).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts({ page, limit, search: searchTerm, category: selectedCategory, sortBy, sortOrder }));
            resetForm();
            toast({ title: "Product added successfully" });
          }
        });
  }

  function handleDelete(getCurrentProductId) {
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts({ page, limit, search: searchTerm, category: selectedCategory, sortBy, sortOrder }));
        toast({ title: "Product deleted successfully" });
      }
    });
  }

  function isFormValid() {
    return Object.keys(formData)
      .filter((key) => key === "title")
      .every((key) => formData[key] !== "");
  }

  function resetForm() {
    setFormData(initialFormData);
    setUploadedImageUrl("");
    setImageFile(null);
    setImageLoadingState(false);
    setCurrentEditedId(null);
    setOpenCreateProductsDialog(false);
  }

  useEffect(() => {
    dispatch(fetchAllProducts({ page, limit, search: searchTerm, category: selectedCategory, sortBy, sortOrder }));

    async function fetchCategories() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`);
        const data = await res.json();
        setAllCategories(flattenCategories(data));
      } catch (err) {
        console.error("❌ Failed to fetch categories", err);
      }
    }
    fetchCategories();
  }, [dispatch, page, limit, searchTerm, selectedCategory, sortBy, sortOrder]);

  const filterUI = (
    <div className="flex items-center gap-4">
      <Input
        placeholder="Search title..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setPage(1);
        }}
        className="max-w-sm"
      />
      <select
        value={selectedCategory}
        onChange={(e) => {
          setSelectedCategory(e.target.value);
          setPage(1);
        }}
        className="border rounded px-3 py-2 text-sm"
      >
        <option value="">All Categories</option>
        {allCategories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>
      <Button asChild>
        <a href="/admin/products/new">+ Create New Product</a>
      </Button>
    </div>
  );

  return (
    <Fragment>
      <DataTable
        columns={productColumns.map((col) =>
          typeof col.cell === "function"
            ? {
                ...col,
                sortable: ["title", "totalStock", "price", "isActive"].includes(col.accessorKey),
                cell: (row) =>
                  col.cell({
                    ...row,
                    navigate: (path) => (window.location.href = path),
                    setQuickEdit: setCurrentEditedId,
                    setFormData: (rowData) =>
                      setFormData({
                        ...rowData,
                        categories: (rowData.categories || []).map((c) =>
                          typeof c === "object" ? c._id : c
                        ),
                      }),
                    setOpenCreateProductsDialog,
                    onDelete: handleDelete,
                  }),
              }
            : col
        )}
        data={productList}
        filterUI={filterUI}
        total={total}
        page={page}
        onPageChange={setPage}
        limit={limit}
        onLimitChange={(val) => {
          setLimit(val);
          setPage(1);
        }}
        search={searchTerm}
        category={selectedCategory}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={({ sortBy, sortOrder }) => {
          setSortBy(sortBy);
          setSortOrder(sortOrder);
        }}
        allCategories={allCategories}
      />

      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={(isOpen) => {
          if (!isOpen) resetForm();
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Quick Edit Product" : "Add New Product"}
            </SheetTitle>
          </SheetHeader>
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={(file) => {
              setImageFile(file);
              setUploadedImageUrl("");
            }}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
          />
          <div className="py-6 space-y-4">
            <CategorySelector
              selected={formData.categories}
              onChange={(val) => setFormData({ ...formData, categories: val })}
            />
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Save" : "Add"}
              formControls={addProductFormElements.filter((item) => item.name !== "categories")}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;
