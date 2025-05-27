import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSideBar from "./sidebar";
import AdminHeader from "./header";

function AdminLayout({ fullscreen = false, children }) {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {!fullscreen && (
        <AdminSideBar open={openSidebar} setOpen={setOpenSidebar} />
      )}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* 👇 This now supports both nested <Outlet /> OR direct children */}
        <main className="flex-1 overflow-y-auto bg-muted pt-4 md:pt-0 pb-0">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
