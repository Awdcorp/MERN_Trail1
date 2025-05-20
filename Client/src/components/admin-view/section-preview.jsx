// src/components/admin-view/homepage/section-preview.jsx

export default function SectionPreview({ type }) {
  switch (type) {
    case "slider":
      return (
        <div className="bg-gradient-to-r from-purple-300 to-indigo-300 rounded-md p-4 text-white w-60 h-32 flex items-center justify-center text-sm">
          Slider Preview
        </div>
      );

    case "product-slider":
      return (
        <div className="bg-white border rounded-md p-2 w-60 h-32 overflow-hidden">
          <div className="text-xs font-medium text-gray-600">Product Slider</div>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-gray-200 rounded-sm" />
            ))}
          </div>
        </div>
      );

    case "category-grid":
      return (
        <div className="bg-white border rounded-md p-2 w-60 h-32 overflow-hidden">
          <div className="text-xs font-medium text-gray-600">Category Grid</div>
          <div className="grid grid-cols-3 gap-1 mt-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 bg-yellow-100 rounded-sm" />
            ))}
          </div>
        </div>
      );

    case "theme-grid":
      return (
        <div className="bg-white border rounded-md p-2 w-60 h-32 overflow-hidden">
          <div className="text-xs font-medium text-gray-600">Theme Grid</div>
          <div className="grid grid-cols-2 gap-1 mt-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-6 bg-pink-100 rounded-sm" />
            ))}
          </div>
        </div>
      );

    case "party-packages":
      return (
        <div className="bg-white border rounded-md p-2 w-60 h-32 overflow-hidden">
          <div className="text-xs font-medium text-gray-600">Party Packages</div>
          <div className="flex gap-1 mt-2">
            <div className="w-16 h-16 bg-blue-100 rounded" />
            <div className="w-16 h-16 bg-blue-200 rounded" />
          </div>
        </div>
      );

    case "store-locations":
      return (
        <div className="bg-white border rounded-md p-2 w-60 h-32 overflow-hidden">
          <div className="text-xs font-medium text-gray-600">Store Locations</div>
          <div className="mt-2 text-[10px] text-gray-400">Google map iframe preview</div>
        </div>
      );

    case "contact-info":
      return (
        <div className="bg-white border rounded-md p-2 w-60 h-32 overflow-hidden">
          <div className="text-xs font-medium text-gray-600">Contact Info</div>
          <div className="mt-2 text-[10px] text-gray-400">Phone & WhatsApp cards</div>
        </div>
      );

    default:
      return <div className="w-60 h-32 bg-gray-100 text-center text-sm flex items-center justify-center">Unknown section</div>;
  }
}