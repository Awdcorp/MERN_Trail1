import { useEffect, useState } from "react";
import axios from "axios";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";

function ProductFilter({ filters, handleFilter }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/categories")
      .then(res => setCategories(res.data))
      .catch(err => console.error("❌ Failed to fetch categories:", err));
  }, []);

  const renderCategoryTree = (categoryList, level = 0) => {
    return categoryList.map(cat => (
      <div key={cat._id} style={{ marginLeft: `${level * 16}px` }}>
        <Label className="flex items-center gap-2">
          <Checkbox
            checked={filters?.category?.includes(cat._id)}
            onCheckedChange={(checked) =>
              handleFilter("category", cat._id, checked)
            }
          />
          {cat.name}
        </Label>
        {Array.isArray(cat.children) && cat.children.length > 0 && (
          <div>{renderCategoryTree(cat.children, level + 1)}</div>
        )}
      </div>
    ));
  };

  return (
    <div className="bg-background rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-extrabold">Filters</h2>
      </div>
      <div className="p-4 space-y-4">
        {categories.length > 0 && (
          <div>
<button
  className="px-3 py-1 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary/80 transition-all mb-3"
  onClick={() => handleFilter('clear')}
>
Clear All Filters
</button>
            <h3 className="text-base font-bold">Category</h3>
            <div className="max-h-[300px] overflow-y-auto pr-2 gap-2 mt-2">
              {renderCategoryTree(categories)}
            </div>
          </div>
        )}
        <Separator className="my-4" />
      </div>
    </div>
  );
}

export default ProductFilter;
