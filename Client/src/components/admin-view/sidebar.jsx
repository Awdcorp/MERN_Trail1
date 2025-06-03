import {
  BadgeCheck,
  ChartNoAxesCombined,
  LayoutDashboard,
  ShoppingBasket,
  Images,
  Users,
  Home,
  Settings,
  Menu,
  LogOut,
  Brush,
  ShoppingBag,
  FileStack,
  FileSignature,
  AppWindow ,
} from "lucide-react";
import { Fragment, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";

const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: <ShoppingBasket />,
    children: [
      {
        id: "all-products",
        label: "All Products",
        path: "/admin/products",
      },
      {
        id: "product-categories",
        label: "Categories",
        path: "/admin/category",
      },
      {
        id: "inventory",
        label: "Inventory",
        path: "/admin/inventory",
      },
      {
        id: "Import Export",
        label: "Import/Export",
        path: "/admin/AdminImportHistory",
      },
    ],
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: <BadgeCheck />,
  },
  {
    id: "media",
    label: "Media",
    path: "/admin/media",
    icon: <Images />,
  },
  {
    id: "menus",
    label: "Menus",
    path: "/admin/menus",
    icon: <Menu />,
  },
  {
    id: "settings",
    label: "SEO Settings",
    path: "/admin/settings",
    icon: <Settings />,
  },
  {
    id: "users",
    label: "User",
    path: "/admin/users",
    icon: <Users />,
  },
  {
    id: "cms",
    label: "CMS",
    path: "/admin/pagecontent",
    icon: <AppWindow  />,
  },
  {
    id: "pages",
    label: "Appearance",
    path: "/admin/pages",
    icon: <Brush />,
    children: [
      {
        id: "all-pages",
        label: "Pages",
        path: "/admin/pages",
      },
      {
        id: "Announcement",
        label: "Announcement Bar",
        path: "/admin/announcement",
      },
    ],
  },
  {
    id: "shop",
    label: "Shop",
    path: "/admin/collections",
    icon: <ShoppingBag />,
    children: [
      {
        id: "collections",
        label: "Collections",
        path: "/admin/collections",
      },
      {
        id: "cupon",
        label: "Discounts",
        path: "/admin/cupon",
      },
    ],
  },
  {
    id: "blogs",
    label: "Blogs",
    path: "/admin/blogs",
    icon: <FileStack />,
    children: [
      {
        id: "all-blogs",
        label: "Blogs",
        path: "/admin/blogs",
      },
      {
        id: "categories",
        label: "Categories",
        path: "/admin/category",
      },
    ],
  },
  
  {
    id: "forms",
    label: "Forms",
    path: "/admin/contact-messages",
    icon: <FileSignature />,
  },
];

function MenuItems({ setOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenu, setExpandedMenu] = useState(null);

  useEffect(() => {
    const matchedParent = adminSidebarMenuItems.find((item) =>
      item.children?.some((child) =>
        location.pathname.startsWith(child.path)
      )
    );
    if (matchedParent) {
      setExpandedMenu(matchedParent.id);
    } else {
      setExpandedMenu(null);
    }
  }, [location.pathname]);

  const toggleMenuAndNavigate = (menuItem) => {
    if (menuItem.path) {
      navigate(menuItem.path);
    }
    setExpandedMenu(menuItem.id);
  };

  return (
    <nav className="flex flex-col gap-2 flex-1">
      {adminSidebarMenuItems.map((menuItem) => {
        const isParent = !!menuItem.children;

        const isDirectMatch = !isParent && menuItem.path === location.pathname;
        const isChildPathMatch = menuItem.children?.some((child) =>
          location.pathname.startsWith(child.path)
        );

        const parentClasses =
          isDirectMatch
            ? "bg-[#393E46] text-white font-semibold"
            : "text-foreground hover:bg-muted hover:text-foreground";

        if (isParent) {
          return (
            <div key={menuItem.id} className="flex flex-col">
              <div
                onClick={() => toggleMenuAndNavigate(menuItem)}
                className={`flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-xl ${parentClasses}`}
              >
                {menuItem.icon}
                <span>{menuItem.label}</span>
              </div>

              {expandedMenu === menuItem.id && (
                <div className="ml-6 mt-1 flex flex-col gap-1">
                  {menuItem.children.map((child) => {
                    const isActive = location.pathname.startsWith(child.path);
                    return (
                      <div
                        key={child.id}
                        onClick={() => navigate(child.path)}
                        className={`cursor-pointer px-2 py-1 rounded-md text-sm ${
                          isActive
                            ? "bg-[#393E46] text-white font-medium"
                            : "text-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        {child.label}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        }

        return (
          <div
            key={menuItem.id}
            onClick={() => navigate(menuItem.path)}
            className={`flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-xl ${parentClasses}`}
          >
            {menuItem.icon}
            <span>{menuItem.label}</span>
          </div>
        );
      })}
    </nav>
  );
}

export default function Sidebar() {
  const dispatch = useDispatch();

  return (
    <div className="p-4 h-screen flex flex-col">
      {/* Make the scrollable content wrapper take all vertical space except logout */}
      <div className="flex-1 overflow-y-auto pr-1 scrollbar-hide">
        <MenuItems />
      </div>

      {/* Keep logout button fixed at bottom */}
      <div className="pt-4">
        <div
          onClick={() => dispatch(logoutUser())}
          className="bg-[#393E46] cursor-pointer text-white hover:text-red-500 flex gap-2 items-center px-3 py-2 rounded-md hover:bg-muted"
        >
          <LogOut />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
}

