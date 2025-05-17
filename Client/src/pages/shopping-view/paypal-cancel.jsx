import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { XCircle } from "lucide-react";

export default function PayPalCancelPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("🛑 PayPal Payment Cancelled. Token:", token);

    // Redirect to cart after 5 seconds
    const timer = setTimeout(() => {
      navigate("/shop/cart");
    }, 5000);

    return () => clearTimeout(timer);
  }, [token, navigate]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="flex justify-center mb-4">
          <XCircle className="text-red-500" size={48} />
        </div>
        <h1 className="text-2xl font-bold text-red-600 mb-2">Payment Cancelled</h1>
        <p className="text-gray-700 mb-6">
          You cancelled the PayPal payment process. No money was deducted. <br />
          You will be redirected back to your cart shortly.
        </p>
        <button
          onClick={() => navigate("/shop/checkout")}
          className="bg-[#00B0BA] text-white px-5 py-2 rounded hover:bg-[#0093a0] transition"
        >
          Return to Cart Now
        </button>
      </div>
    </div>
  );
}
