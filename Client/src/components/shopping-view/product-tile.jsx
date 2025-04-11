import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap } from "@/config";
import { Badge } from "../ui/badge";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  return (
<Card className="w-full max-w-sm mx-auto flex flex-col h-full">
  <div className="relative" onClick={() => handleGetProductDetails(product?._id)}>
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
  </div>

  {/* 👇 This now properly pushes footer to bottom */}
  <CardContent className="p-3 text-sm flex flex-col flex-grow cursor-pointer" onClick={() => handleGetProductDetails(product?._id)}>
    <h3 className="text-base font-semibold mb-1">{product?.title}</h3>
    <div className="flex justify-between items-center mb-1">
      <span className="text-[14px] text-muted-foreground">
        {product?.categories?.[0]?.name || "Uncategorized"}
      </span>
      <span className="text-[14px] text-muted-foreground">
        {brandOptionsMap[product?.brand]}
      </span>
    </div>
    <div className="flex flex-col items-center mt-auto">
      <span className={`text-lg font-semibold text-primary ${product?.salePrice > 0 ? "line-through" : ""}`}>
        ${product?.price}
      </span>
      {product?.salePrice > 0 && (
        <span className="text-lg font-semibold text-primary mt-1">${product?.salePrice}</span>
      )}
    </div>
  </CardContent>

  <CardFooter>
    {product?.totalStock === 0 ? (
      <Button className="w-full opacity-60 cursor-not-allowed" disabled>
        Out Of Stock
      </Button>
    ) : (
      <Button
        className="w-full"
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
