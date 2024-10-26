import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { addFeatureImage, getFeatureImages, deleteFeatureImage } from "@/store/common-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]); // Added selectedImages state
  const [isEditMode, setIsEditMode] = useState(false); // Add isEditMode state
  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);

  console.log(uploadedImageUrl, "uploadedImageUrl");

  function handleUploadFeatureImage() {
    if (!uploadedImageUrl) return; // No image to upload
    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl("");
      }
    });
  }

  // Delete feature image handler
  const handleDeleteImage = (imageId) => {
    if (!imageId) return; // No ID provided
    dispatch(deleteFeatureImage(imageId)).then((data) => {
      if (data?.payload?.success) {
        console.log("Image deleted successfully");
        dispatch(getFeatureImages()); // Refresh the image list after deletion
      } else {
        console.error("Failed to delete image");
      }
    });
  };

  // Toggle image selection
  const handleImageSelect = (imageId) => {
    if (selectedImages.includes(imageId)) {
      setSelectedImages(selectedImages.filter((id) => id !== imageId));
    } else {
      setSelectedImages([...selectedImages, imageId]);
    }
  };

  // Bulk delete handler
  const handleDeleteSelectedImages = () => {
    if (selectedImages.length === 0) return; // No images selected

    selectedImages.forEach((imageId) => {
      dispatch(deleteFeatureImage(imageId)).then((data) => {
        if (data?.payload?.success) {
          console.log("Image deleted successfully");
        } else {
          console.error("Failed to delete image");
        }
      });
    });

    // Clear selected images and refresh the list
    setSelectedImages([]);
    dispatch(getFeatureImages());
  };

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  console.log(featureImageList, "featureImageList");

  return (
    <div>
      <ProductImageUpload
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploadedImageUrl={uploadedImageUrl}
        setUploadedImageUrl={setUploadedImageUrl}
        setImageLoadingState={setImageLoadingState}
        imageLoadingState={imageLoadingState}
        isCustomStyling={true}
        // isEditMode={currentEditedId !== null}
      />
      <Button onClick={handleUploadFeatureImage} className="mt-5 w-full">
        Upload
      </Button>

      {/* Edit Mode Toggle Button */}
      <Button
        onClick={() => setIsEditMode(!isEditMode)}
        className="mt-5 w-full bg-blue-500 text-white"
      >
        {isEditMode ? "Exit Edit Mode" : "Enter Edit Mode"}
      </Button>

      {isEditMode && selectedImages.length > 0 && (
        <Button
          onClick={handleDeleteSelectedImages}
          className="mt-5 w-full bg-red-500 text-white"
        >
          Delete Selected Images
        </Button>
      )}

      <div className="flex flex-col gap-4 mt-5">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((featureImgItem) => (
              <div className="relative">
                <img
                  src={featureImgItem.image}
                  className={`w-full h-[300px] object-cover rounded-t-lg cursor-pointer ${
                    isEditMode && selectedImages.includes(featureImgItem._id)
                      ? "border-4 border-blue-500 opacity-70"
                      : "border-4 border-transparent"
                  }`}
                  onClick={() => isEditMode && handleImageSelect(featureImgItem._id)} // Only selectable in edit mode
                />
                {/* Conditionally render the checkbox based on isEditMode */}
                {isEditMode && (
                  <input
                    type="checkbox"
                    className="absolute top-2 left-2"
                    checked={selectedImages.includes(featureImgItem._id)}
                    onChange={() => handleImageSelect(featureImgItem._id)}
                  />
                )}
                {/* Delete Button */}
                <Button
                  className="absolute top-2 right-2 bg-red-500 text-white"
                  onClick={() => handleDeleteImage(featureImgItem._id)} // Assume featureImgItem has an `id`
                >
                  Delete
                </Button>
              </div>
            ))
          : null}
      </div>
    </div>
  );
}

export default AdminDashboard;
