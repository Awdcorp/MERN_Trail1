import React, { useState } from "react"; // ✅ Added 'React' and 'useState'
import { Outlet } from "react-router-dom";
import AdminSideBar from "./sidebar";
import AdminHeader from "./header";

function AdminLayout() {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Fixed Sidebar */}
      <AdminSideBar open={openSidebar} setOpen={setOpenSidebar} />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Fixed Header */}
        <AdminHeader setOpen={setOpenSidebar} />

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto bg-muted/40 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
