import { useEffect, useState } from "react";
import CommonForm from "../common/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddress,
  deleteAddress,
  editaAddress,
  fetchAllAddresses,
} from "@/store/shop/address-slice";
import AddressCard from "./address-card";
import { useToast } from "../ui/use-toast";
import { getGuestId } from "@/lib/guest-id";

const initialAddressFormData = {
  address: "",
  city: "",
  phone: "",
  pincode: "",
  notes: "",
};

function Address({ setCurrentSelectedAddress, selectedId }) {
  const [formData, setFormData] = useState(initialAddressFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);
  const { toast } = useToast();

  // Determine owner ID for both users and guests
  const ownerId = user?.id || getGuestId();

  // Add or edit address
  function handleManageAddress(event) {
    event.preventDefault();

    if (addressList.length >= 3 && currentEditedId === null) {
      setFormData(initialAddressFormData);
      toast({
        title: "You can add max 3 addresses",
        variant: "destructive",
      });
      return;
    }

    if (currentEditedId !== null) {
      dispatch(
        editaAddress({
          userId: ownerId,
          addressId: currentEditedId,
          formData,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllAddresses(ownerId));
          setCurrentEditedId(null);
          setFormData(initialAddressFormData);
          toast({ title: "Address updated successfully" });
        }
      });
    } else {
      dispatch(
        addNewAddress({
          ...formData,
          userId: user?.id || null,
          guestId: user?.id ? null : ownerId,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllAddresses(ownerId));
          setFormData(initialAddressFormData);
          toast({ title: "Address added successfully" });
        }
      });
    }
  }

  // Delete address
  function handleDeleteAddress(addressItem) {
    dispatch(
      deleteAddress({ userId: ownerId, addressId: addressItem._id })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllAddresses(ownerId));
        toast({ title: "Address deleted successfully" });
      }
    });
  }

  // Prefill form for editing
  function handleEditAddress(addressItem) {
    setCurrentEditedId(addressItem._id);
    setFormData({
      address: addressItem.address,
      city: addressItem.city,
      phone: addressItem.phone,
      pincode: addressItem.pincode,
      notes: addressItem.notes,
    });
  }

  function isFormValid() {
    return Object.values(formData).every((val) => val.trim() !== "");
  }

  // Fetch addresses for owner on mount or when ownerId changes
  useEffect(() => {
    dispatch(fetchAllAddresses(ownerId));
  }, [dispatch, ownerId]);

  return (
    <Card>
      <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {addressList.length > 0 &&
          addressList.map((singleAddressItem) => (
            <AddressCard
              key={singleAddressItem._id}
              selectedId={selectedId}
              handleDeleteAddress={handleDeleteAddress}
              addressInfo={singleAddressItem}
              handleEditAddress={handleEditAddress}
              setCurrentSelectedAddress={setCurrentSelectedAddress}
            />
          ))}
      </div>
      <CardHeader>
        <CardTitle>
          {currentEditedId !== null ? "Edit Address" : "Add New Address"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <CommonForm
          formControls={addressFormControls}
          formData={formData}
          setFormData={setFormData}
          buttonText={currentEditedId !== null ? "Edit" : "Add"}
          onSubmit={handleManageAddress}
          isBtnDisabled={!isFormValid()}
        />
      </CardContent>
    </Card>
  );
}

export default Address;
