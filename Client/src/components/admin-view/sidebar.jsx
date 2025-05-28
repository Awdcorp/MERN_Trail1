import {
  BadgeCheck,
  ChartNoAxesCombined,
  LayoutDashboard,
  ShoppingBasket,
  Images,
  Users,
  Home,
  Settings,
  LogOut,
  Brush,
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
        id: "blogs",
        label: "Blogs",
        path: "/admin/blogs",
      },
      {
        id: "Announcement",
        label: "Announcement Bar",
        path: "/admin/announcement",
      },
    ],
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
    <nav className="mt-8 flex-col flex gap-2">
      {adminSidebarMenuItems.map((menuItem) => {
        const isParent = !!menuItem.children;

        const isDirectMatch = !isParent && menuItem.path === location.pathname;
        const isChildPathMatch = menuItem.children?.some((child) =>
          location.pathname.startsWith(child.path)
        );

        const parentClasses =
          isDirectMatch
            ? "bg-muted text-foreground font-semibold"
            : "text-muted-foreground hover:bg-muted hover:text-foreground";

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
                            ? "bg-accent text-accent-foreground font-medium"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
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
    <div className="p-4">
      <MenuItems />
      <div
        onClick={() => dispatch(logoutUser())}
        className="mt-10 cursor-pointer text-muted-foreground hover:text-red-500 flex gap-2 items-center px-3 py-2"
      >
        <LogOut />
        <span>Logout</span>
      </div>
    </div>
  );
}
