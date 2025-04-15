// File: Client/src/components/shopping-view/product-tile.jsx

import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Link } from "react-router-dom";

function ShoppingProductTile({ product, handleAddtoCart }) {
  return (
    <Card className="w-full max-w-sm mx-auto flex flex-col h-full">
      <Link to={`/shop/product/${product.slug}`} className="relative block">
        <img
          src={product?.images?.[0] || "/placeholder.png"}
          alt={product?.title}
          loading="lazy"
          className="w-full h-40 object-contain"
        />
        {product?.totalStock === 0 ? (
          <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
            Out Of Stock
          </Badge>
        ) : product?.totalStock < 10 ? (
          <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
            {`Only ${product?.totalStock} left`}
          </Badge>
        ) : product?.salePrice > 0 ? (
          <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">Sale</Badge>
        ) : null}
      </Link>

  {/* 👇 This now properly pushes footer to bottom */}
  <CardContent className="p-3 text-sm flex flex-col flex-grow cursor-pointer" onClick={() => handleGetProductDetails(product?._id)}>
    <h3 className="text-center text-[15px] font-medium text-[#463970] leading-snug truncate mb-1">{product?.title}</h3>
    <div className="flex justify-between items-center mb-1">
    </div>
    <div className="flex flex-col items-center mt-auto">
      <span className={`text-[14px]] font-medium text-primary ${product?.salePrice > 0 ? "line-through" : ""}`}>
        {product?.price}.00 AED
      </span>
      {product?.salePrice > 0 && (
        <span className="text-lg font-semibold text-primary mt-1">{product?.salePrice}.00 AED</span>
      )}
    </div>
  </CardContent>

  <CardFooter>
    {product?.totalStock === 0 ? (
      <Button className="bg-[#463970] text-white rounded-2xl px-6 py-2 w-full opacity-60 cursor-not-allowed" disabled>
        Out Of Stock
      </Button>
    ) : (
      <Button
        className="bg-[#463970] text-white rounded-3xl px-6 py-2 w-full"
        onClick={() => handleAddtoCart(product?._id, product?.totalStock)}
      >
        Add to cart
      </Button>
    )}
  </CardFooter>
</Card>

  );
}

export default ShoppingProductTile;
