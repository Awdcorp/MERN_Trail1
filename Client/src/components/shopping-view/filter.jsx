import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

function getColorValue(colorName) {
  const colorMap = {
    black: "#000000",
    blue: "#0000FF",
    cream: "#f8f8f2",
    gold: "#FFD700",
    gray: "#808080",
    green: "#00FF00",
    lavender: "#B57EDC",
    multicolour: "linear-gradient(45deg, red, blue)",
    orange: "#FFA500",
    peach: "#FFE5B4",
    pink: "#FFC0CB",
    purple: "#800080",
    red: "#FF0000",
    rose: "#C08081",
    "rose gold": "#b76e79",
    silver: "#C0C0C0",
    white: "#FFFFFF",
    yellow: "#FFFF00",
  };

  return colorMap[colorName] || "#ccc";
}

function ProductFilter({ filters, handleFilter }) {
  const [filterGroups, setFilterGroups] = useState([]);

  useEffect(() => {
    const customFilters = [
      {
        id: "gender",
        label: "Gender",
        options: ["Male", "Female", "Unisex"],
      },
      {
        id: "ageGroup",
        label: "Age Group",
        options: ["Baby", "Toddler", "Child", "Adult"],
      },
      {
        id: "color",
        label: "Color",
        options: [
          "Black", "Blue", "Cream", "Gold", "Gray", "Green", "Lavender",
          "Multicolour", "Orange", "Peach", "Pink", "Purple", "Red",
          "Rose Gold", "Silver", "White", "Yellow"
        ],
      },
      {
        id: "occasion",
        label: "Occasions",
        options: [
          "Baby Shower", "Bachelorette", "Back to School", "Birthday", "Bridal Shower",
          "Chinese New Year", "Christmas", "Easter", "Eid", "Engagement", "Father's Day",
          "Gender Reveal", "Graduation", "Halloween", "Mother's Day", "Ramadan",
          "St. Patrick's Day", "Teacher's Day", "UAE National Day", "Valentine's Day",
          "Wedding"
        ],
      },
      {
        id: "theme",
        label: "By Theme",
        options: [
          "Adult Themes", "Avengers", "Baby Shark", "Batman", "Blippi", "Boy Themes",
          "Cars", "Cocomelon", "Construction", "Despicable Me", "Dinosaurs",
          "Disco Fever", "Disney Themes", "Fireman Sam", "First Birthday",
          "Fortnite", "Frozen", "Girl Themes", "Hello Kitty", "Hollywood", "Jungle",
          "Justice League", "Marvel", "Mickey & Minnie", "Nautical", "Neon",
          "Paw Patrol", "Pirates", "PJ Masks", "Plain Colours", "Pokemon", "Princess",
          "Roblox", "Spiderman", "Sports", "Star Wars", "Summer Themes",
          "Super Mario Bros", "Superman", "Young Children Themes"
        ],
      },
    ];
    setFilterGroups(customFilters);
  }, []);

  return (
    <div className="bg-background rounded-lg shadow-sm max-h-[120vh] overflow-y-auto relative scrollbar-hide">
      <div className="p-4 pb-6 border-b sticky top-0 bg-background z-10">
        <button
          className="px-7 py-3 rounded-md bg-[#46396F] text-white text-sm font-semibold hover:bg-[#463970] transition-all"
          onClick={() => handleFilter("clear")}
        >
          Clear All Filters
        </button>
      </div>
      <div className="pl-4 pr-0 space-y-2 pt-3 pb-6">
        {filterGroups.map((group) => (
          <div key={group.id}>
            <h3 className="text-base uppercase text-[13px] text-[#484848] mb-2">{group.label}</h3>
            <div
              className={`${
                group.id === "color" ? "grid grid-cols-2 gap-x-2" : "space-y-1"
              } max-h-[200px] overflow-y-auto pr-2 scrollbar-hide`}
            >
              {group.options.map((option) => (
                <Label
                  key={option}
                  className={`flex items-center gap-2 cursor-pointer text-[#484848] ${
                    group.id === "color" ? "mb-1" : ""
                  }`}
                >
<Checkbox
  checked={!!filters[group.id]?.includes(option)}
  onCheckedChange={() => handleFilter(group.id, option)}
  id={`${group.id}-${option}`}
  className="w-4 h-4 border rounded"
/>
<span className="text-sm">
  {group.id === "color" ? (
    <div className="flex items-center gap-2">
      <div
        className="w-4 h-4 rounded-sm border"
        style={{ backgroundColor: getColorValue(option.toLowerCase()) }}
      />
      {option}
    </div>
  ) : (
    option
  )}
</span>
                </Label>
              ))}
            </div>
            <Separator className="my-4" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductFilter;
