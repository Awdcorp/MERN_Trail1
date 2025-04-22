import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getGuestId } from "@/lib/guest-id";
import { migrateGuestCartToUser, fetchCartItems } from "@/store/shop/cart-slice";

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();

  function onSubmit(event) {
    event.preventDefault();
  
    dispatch(loginUser(formData)).then(async (data) => {
      if (data?.payload?.success) {
        toast({ title: data.payload.message });
  
        const guestId = getGuestId();
        const userId = data.payload.user?.id;
        console.log("🧾 [Login] guestId from localStorage:", guestId);
        console.log("👤 [Login] userId from login payload:", userId);

        if (guestId && userId) {
          try {
            console.log("🧠 Attempting migration with", { guestId, userId });
            await dispatch(migrateGuestCartToUser({ guestId, userId }));
            localStorage.removeItem("guest_id");
            toast({ title: "✅ Guest cart successfully merged!" });
            await dispatch(fetchCartItems(userId));         
          } catch (err) {
            console.error("❌ Cart migration failed:", err);
          }
        }
  
        // ✅ Check if user is admin
        if (data.payload.user?.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/shop/home");
        }
      } else {
        toast({
          title: data?.payload?.message,
          variant: "destructive",
        });
      }
    });
  }
  

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Sign in to your account
        </h1>
        <p className="mt-2">
          Don't have an account
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/register"
          >
            Register
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={loginFormControls}
        buttonText={"Sign In"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default AuthLogin;
