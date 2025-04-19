import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductRow from "@/components/admin-view/product-tile";
import AdminPanelTemplate from "@/components/admin-view/AdminPanelTemplate";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { addProductFormElements } from "@/config";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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

  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();
    const updatedFormData = {
      ...formData,
      image: uploadedImageUrl || formData.image || "",
    };

    currentEditedId !== null
      ? dispatch(
          editProduct({ id: currentEditedId, formData: updatedFormData })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            resetForm();
            toast({ title: "Product updated successfully" });
          }
        })
      : dispatch(addNewProduct(updatedFormData)).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            resetForm();
            toast({ title: "Product added successfully" });
          }
        });
  }

  function handleDelete(getCurrentProductId) {
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
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
    dispatch(fetchAllProducts());

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
  }, [dispatch]);

  return (
    <Fragment>
      <AdminPanelTemplate
        title="All Products"
        columns={[
          { label: "", align: "left" },
          { label: "Product" },
          { label: "Status" },
          { label: "Stock" },
          { label: "Category" },
          { label: "Brand" },
          { label: "Price" },
          { label: "Actions", align: "right" },
        ]}
        actions={
          <Button onClick={() => setOpenCreateProductsDialog(true)}>
            Add New Product
          </Button>
        }
      >
        {productList?.map((productItem) => (
          <AdminProductRow
            key={productItem._id}
            product={productItem}
            setFormData={setFormData}
            setOpenCreateProductsDialog={setOpenCreateProductsDialog}
            setCurrentEditedId={setCurrentEditedId}
            handleDelete={handleDelete}
          />
        ))}
      </AdminPanelTemplate>

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
          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Save" : "Add"}
              formControls={addProductFormElements.map((item) =>
                item.name === "categories"
                  ? { ...item, options: allCategories }
                  : item
              )}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;
