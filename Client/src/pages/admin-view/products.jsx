import { Fragment, useEffect, useState } from "react";
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
import CSVPreviewModal from "@/components/admin-view/CSVPreviewModal";
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

const allExportableFields = [
  "title", "slug", "description", "shortDescription",
  "categories", "brand", "price", "salePrice", "totalStock", "weight", "sku", "tags",
  "images", "variants", "attributes",
  "relatedProductIds", "upsellProductIds",
  "isActive", "isFeatured", "externalId",
  "averageReview", "meta", "seo"
];

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
  const dispatch = useDispatch();
  const { productList, total } = useSelector((state) => state.adminProducts);
  const { toast } = useToast();

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
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [selectedFields, setSelectedFields] = useState(allExportableFields);
  const [importSummary, setImportSummary] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [pendingCSVFile, setPendingCSVFile] = useState(null);

  function onSubmit(event) {
    event.preventDefault();
    const updatedFormData = {
      ...formData,
      image: uploadedImageUrl || formData.image || "",
    };

    const action = currentEditedId !== null
      ? editProduct({ id: currentEditedId, formData: updatedFormData })
      : addNewProduct(updatedFormData);

    dispatch(action).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts({ page, limit, search: searchTerm, category: selectedCategory, sortBy, sortOrder }));
        resetForm();
        toast({ title: `Product ${currentEditedId ? "updated" : "added"} successfully` });
      }
    });
  }

  async function handleExportProducts() {
    const queryFields = selectedFields.map((f) => `fields=${f}`).join("&");
    const queryIds = selectedProductIds.length > 0 ? `&ids=${selectedProductIds.join(",")}` : "";
    const url = `${import.meta.env.VITE_API_URL}/api/admin/products/export?${queryFields}${queryIds}`;

    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "products_export.csv";
      link.click();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("❌ [EXPORT] Failed:", err);
      toast({ title: "Export failed", variant: "destructive" });
    }
  }

  const handleCSVPreview = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPendingCSVFile(file);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/products/preview-csv`, {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (result.success) {
        setPreviewData(result);
      } else {
        toast({ title: "Invalid CSV file", variant: "destructive" });
      }
    } catch (err) {
      console.error("CSV preview failed", err);
      toast({ title: "CSV preview failed", variant: "destructive" });
    }
  };

  const handlePreviewConfirm = async (mapping) => {
    if (!pendingCSVFile) return;
    const formData = new FormData();
    formData.append("file", pendingCSVFile);
    formData.append("mapping", JSON.stringify(mapping));

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/products/import`, {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (result.success) {
        setImportSummary({
          imported: result.importedCount,
          skipped: result.skippedCount,
          skippedRows: result.skippedRows || [],
        });
        dispatch(fetchAllProducts({ page, limit, search: searchTerm, category: selectedCategory, sortBy, sortOrder }));
      } else {
        toast({ title: result.message || "Import failed", variant: "destructive" });
      }
    } catch (err) {
      console.error("CSV import failed", err);
      toast({ title: "CSV import failed", variant: "destructive" });
    } finally {
      setPreviewData(null);
      setPendingCSVFile(null);
    }
  };
function isFormValid() {
  return formData.title?.trim() !== "";
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
    <div className="flex items-center gap-4 flex-wrap">
      <Input placeholder="Search title..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }} className="max-w-sm" />
      <select value={selectedCategory} onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }} className="border rounded px-3 py-2 text-sm">
        <option value="">All Categories</option>
        {allCategories.map((cat) => (
          <option key={cat._id} value={cat._id}>{cat.name}</option>
        ))}
      </select>
      <Button asChild><a href="/admin/products/new">+ Create New Product</a></Button>
      <Button variant="outline" onClick={() => setShowExportDialog(true)}>Export Settings</Button>
      <div className="relative overflow-hidden">
  <Button variant="outline">Import CSV</Button>
  <input
    type="file"
    accept=".csv"
    onChange={handleCSVPreview}
    className="absolute inset-0 opacity-0 cursor-pointer"
  />
</div>

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
                    onDelete: (id) => dispatch(deleteProduct(id)).then(() => {
                      toast({ title: "Product deleted" });
                      dispatch(fetchAllProducts({ page, limit, search: searchTerm, category: selectedCategory, sortBy, sortOrder }));
                    }),
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
        onRowSelectionChange={(ids) => setSelectedProductIds(ids)}
      />

      <Sheet open={openCreateProductsDialog} onOpenChange={(isOpen) => { if (!isOpen) resetForm(); }}>
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>{currentEditedId !== null ? "Quick Edit Product" : "Add New Product"}</SheetTitle>
          </SheetHeader>
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={(file) => { setImageFile(file); setUploadedImageUrl(""); }}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
          />
          <div className="py-6 space-y-4">
            <CategorySelector compact={true} selected={formData.categories} onChange={(val) => setFormData({ ...formData, categories: val })} />
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

      {showExportDialog && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[500px] max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Select Fields to Export</h2>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {allExportableFields.map((field) => (
                <label key={field} className="flex items-center space-x-2">
                  <input type="checkbox" checked={selectedFields.includes(field)} onChange={(e) => {
                    if (e.target.checked) setSelectedFields([...selectedFields, field]);
                    else setSelectedFields(selectedFields.filter((f) => f !== field));
                  }} />
                  <span className="capitalize">{field}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setShowExportDialog(false)}>Cancel</Button>
              <Button onClick={() => { setShowExportDialog(false); handleExportProducts(); }}>Export</Button>
            </div>
          </div>
        </div>
      )}

      {previewData && (
        <CSVPreviewModal
          previewData={previewData}
          onClose={() => setPreviewData(null)}
          onConfirm={handlePreviewConfirm}
        />
      )}

      {importSummary && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <h2 className="text-xl font-semibold mb-3">Import Summary</h2>
            <p className="mb-1">✅ Imported: {importSummary.imported}</p>
            <p className="mb-2">⚠️ Skipped: {importSummary.skipped}</p>
            {importSummary.skippedRows.length > 0 && (
              <div className="text-sm text-muted-foreground">
                <strong>Skipped Rows:</strong>
                <ul className="list-disc pl-5">
                  {importSummary.skippedRows.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex justify-between items-center mt-4">
  <Button variant="ghost" onClick={() => setImportSummary(null)}>Close</Button>
  <Button asChild>
    <a href="/admin/AdminImportHistory" target="_blank" rel="noopener noreferrer">
      View Import History
    </a>
  </Button>
</div>

          </div>
        </div>
      )}
    </Fragment>
  );
}

export default AdminProducts;
