import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Link } from "react-router-dom";

function DemoProductTile({ product, handleAddtoCart }) {
  return (
    <Card className="w-full max-w-sm mx-auto flex flex-col h-full border border-gray-200 rounded-xl shadow-sm">
      {/* ✅ Product Image */}
      <Link to={`/shop/product/${product.slug}`} className="relative block">
        <img
          src={product?.images?.[0] || "/placeholder.png"}
          alt={product?.title}
          loading="lazy"
          className="w-full h-44 object-contain rounded-t-xl"
        />
        {product?.totalStock === 0 ? (
          <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white">
            OUT OF STOCK
          </Badge>
        ) : product?.totalStock < 10 ? (
          <Badge className="absolute top-2 left-2 bg-yellow-500 hover:bg-yellow-600 text-white">
            ONLY {product?.totalStock} LEFT
          </Badge>
        ) : product?.salePrice > 0 ? (
          <Badge className="absolute top-2 left-2 bg-[#a5b4fc] hover:bg-[#8f9df7] text-white">
            SALE
          </Badge>
        ) : null}
      </Link>

      {/* ✅ Content Area */}
      <CardContent className="p-3 text-sm flex flex-col flex-grow">
        <h3 className="text-[14px] font-semibold text-[#1f2937] leading-snug mb-1 truncate text-center">
          {product?.title}
        </h3>

        <div className="mt-auto space-y-1">
          <span
            className={`text-sm font-medium text-gray-500 ${
              product?.salePrice > 0 ? "line-through" : ""
            }`}
          >
            {product?.price}.00 AED
          </span>
          {product?.salePrice > 0 && (
            <span className="text-md font-semibold text-[#a5b4fc]">
              {product?.salePrice}.00 AED
            </span>
          )}
        </div>
      </CardContent>

      {/* ✅ Footer */}
      <CardFooter className="mt-auto px-3 pb-4">
        {product?.totalStock === 0 ? (
          <Button
            disabled
            className="bg-gray-300 text-gray-500 w-full py-2 rounded-md cursor-not-allowed"
          >
            Out of Stock
          </Button>
        ) : (
          <Button
            onClick={() => handleAddtoCart(product?._id, product?.totalStock)}
            className="bg-[#8f9df7] text-white w-full py-2 rounded-md font-medium"
          >
            Add to Cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default DemoProductTile;
