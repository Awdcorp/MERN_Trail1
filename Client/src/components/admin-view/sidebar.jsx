import {
  BadgeCheck,
  ChartNoAxesCombined,
  LayoutDashboard,
  ShoppingBasket,
  Images,
  Users,
  Home,
  Settings,
  LogOut, // ✅ NEW: Import logout icon
} from "lucide-react";
import { Fragment,useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux"; // ✅ NEW: For logout action
import { logoutUser } from "@/store/auth-slice"; // ✅ Adjust path to your logout action
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

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
    id: "products",
    label: "Products",
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
    label: "Settings",
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
    id: "homepage",
    label: "Homepage",
    path: "/admin/homepage",
    icon: <Home />,
  },
];

function MenuItems({ setOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenu, setExpandedMenu] = useState(null);
  
  const toggleMenu = (id) => {
    setExpandedMenu((prev) => (prev === id ? null : id));
  };

  return (
 <nav className="mt-8 flex-col flex gap-2">
            {adminSidebarMenuItems.map((menuItem) => {
        const isParent = !!menuItem.children;

        // ✅ ACTIVE logic — only one item stays active
        let isActive = false;

        if (isParent) {
          isActive = menuItem.children?.some(
            (child) => location.pathname === child.path
          );
        } else if (menuItem.path) {
          isActive = location.pathname === menuItem.path;
        }

        // 🔽 Parent with submenu
        if (isParent) {
          return (
            <div key={menuItem.id} className="flex flex-col">
              <div
                onClick={() => toggleMenu(menuItem.id)}
                className={`flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-xl ${
                  isActive
                    ? "bg-muted text-foreground font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {menuItem.icon}
                <span>{menuItem.label}</span>
              </div>

              {/* Submenu: only visible if toggled open */}
              {expandedMenu === menuItem.id &&
                menuItem.children.map((child) => {
                  const isChildActive = location.pathname === child.path;
                  return (
                    <div
                      key={child.id}
                      onClick={() => {
                        navigate(child.path);
                        setOpen ? setOpen(false) : null;
                      }}
                      className={`ml-6 cursor-pointer rounded-md px-3 py-2 text-sm ${
                        isChildActive
                          ? "bg-muted text-foreground font-semibold"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {child.label}
                    </div>
                  );
                })}
            </div>
          );
        }

        // 🔸 Single-level item
        return (
          <div
            key={menuItem.id}
            onClick={() => {
              navigate(menuItem.path);
              setOpen ? setOpen(false) : null;
            }}
            className={`flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-xl ${
              isActive
                ? "bg-muted text-foreground font-semibold"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {menuItem.icon}
            <span>{menuItem.label}</span>
          </div>
        );
      })}
    </nav>
  );
}

function AdminSideBar({ open, setOpen }) {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // ✅ NEW

  // ✅ Logout logic
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/auth/login");
  };

  return (
    <Fragment>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b">
              <SheetTitle className="flex gap-2 mt-5 mb-5">
                <ChartNoAxesCombined size={30} />
                <h1 className="text-2xl font-extrabold">Admin Panel</h1>
              </SheetTitle>
            </SheetHeader>

            {/* Menu Items */}
            <MenuItems setOpen={setOpen} />

            {/* ✅ Logout Button - Mobile */}
            <div className="mt-auto px-4 pb-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-100"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-background p-6 lg:flex">
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="flex cursor-pointer items-center gap-2"
        >
          <ChartNoAxesCombined size={30} />
          <h1 className="text-2xl font-extrabold">Admin Panel</h1>
        </div>

        {/* Menu Items */}
        <MenuItems />

        {/* ✅ Logout Button - Desktop */}
        <div className="mt-auto pt-8">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-100"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </Fragment>
  );
}

export default AdminSideBar;
