import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import accImg from "../../assets/account.jpg";
import Address from "@/components/shopping-view/address";
import ShoppingOrders from "@/components/shopping-view/orders";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, setUser } from "@/store/auth-slice";
import { Button } from "@/components/ui/button";
import Form from "@/components/common/form";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

function ShoppingAccount() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [tabValue, setTabValue] = useState("orders");
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
  };
  const { toast } = useToast();

  const [editFormData, setEditFormData] = useState({
    userName: user?.userName || "",
    email: user?.email || "",
  });

  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const editProfileFields = [
    { label: "Name", name: "userName", type: "text", componentType: "input" },
    { label: "Email", name: "email", type: "email", componentType: "input" },
  ];

  const changePasswordFields = [
    { label: "Current Password", name: "currentPassword", type: "password", componentType: "input" },
    { label: "New Password", name: "newPassword", type: "password", componentType: "input" },
    { label: "Confirm Password", name: "confirmPassword", type: "password", componentType: "input" },
  ];

  useEffect(() => {
    if (user) {
      setEditFormData({
        userName: user.userName,
        email: user.email,
      });
    }
  }, [user]);

  const handleProfileUpdate = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/update-profile`,
        editFormData,
        { withCredentials: true }
      );

      if (response.data.success) {
        toast({ title: "✅ Profile updated successfully" });
        dispatch(setUser(response.data.user));
        localStorage.removeItem("guest_id"); // ✅ Clear old guest cart session after user update
        setShowEditProfile(false);
      } else {
        toast({ variant: "destructive", title: response.data.message });
      }
    } catch (err) {
      console.error("Update profile error:", err);
      toast({ variant: "destructive", title: "Something went wrong while updating your profile." });
    }
  };

  const handleChangePassword = async () => {
    try {
      const { currentPassword, newPassword, confirmPassword } = passwordFormData;

      if (newPassword !== confirmPassword) {
        return alert("New password and confirm password do not match.");
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/change-password`,
        { currentPassword, newPassword },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast({ title: "✅ Password changed successfully" });
        setPasswordFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setTimeout(() => {
          dispatch(logoutUser());
        }, 500);
      } else {
        toast({ variant: "destructive", title: response.data.message });
      }
    } catch (err) {
      console.error("Change password error:", err);
      toast({ variant: "destructive", title: "Something went wrong while changing password." });
    }
  };

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={accImg} className="h-full w-full object-cover object-center" />
      </div>

      <div className="container mx-auto grid grid-cols-1 gap-8 py-8">
        <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#463970]">My Account</h2>
            {user && (
              <Button onClick={handleLogout} variant="destructive">
                Logout
              </Button>
            )}
          </div>

          <Tabs defaultValue="orders">
            <TabsList>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="address">Address</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="orders">
              <ShoppingOrders />
            </TabsContent>

            <TabsContent value="address">
              <Address />
            </TabsContent>

            <TabsContent value="profile">
              <div className="text-sm space-y-2 mb-6">
                <p><strong>Name:</strong> {user?.userName}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Role:</strong> {user?.role}</p>
              </div>

              <div className="flex gap-4 mb-6">
                <Button onClick={() => setShowEditProfile(!showEditProfile)}>
                  {showEditProfile ? "Cancel Edit" : "Edit Profile"}
                </Button>
                <Button onClick={() => setShowChangePassword(!showChangePassword)}>
                  {showChangePassword ? "Cancel Password" : "Change Password"}
                </Button>
              </div>

              {showEditProfile && (
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-base font-medium mb-4">Edit Profile</h3>
                  <Form
                    formControls={editProfileFields}
                    formData={editFormData}
                    setFormData={setEditFormData}
                    onSubmit={handleProfileUpdate}
                    buttonText="Update Profile"
                  />
                </div>
              )}

              {showChangePassword && (
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-base font-medium mb-4">Change Password</h3>
                  <Form
                    formControls={changePasswordFields}
                    formData={passwordFormData}
                    setFormData={setPasswordFormData}
                    onSubmit={handleChangePassword}
                    buttonText="Change Password"
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default ShoppingAccount;