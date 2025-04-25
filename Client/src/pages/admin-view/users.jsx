import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import AdminPanelTemplate from "@/components/admin-view/AdminPanelTemplate";
import AdminUserRow from "@/components/admin-view/user-tile";

function AdminUsersView() {
  const [userList, setUserList] = useState([]);

  const fetchUsers = async () => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/users`);
      if (res.data.success) setUserList(res.data.data);
    } catch (err) {
      console.error("❌ Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  console.log("👥 Users from API:", userList);

  const handleRoleChange = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/users/${userId}`, { role: newRole });
      fetchUsers();
    } catch (err) {
      console.error("❌ Failed to update role:", err);
    }
  };

  const handleDeactivate = async (userId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/users/${userId}`);
      fetchUsers();
    } catch (err) {
      console.error("❌ Failed to deactivate user:", err);
    }
  };

  const handleReactivate = async (userId) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/users/${userId}`, { isActive: true });
      fetchUsers();
    } catch (err) {
      console.error("❌ Failed to reactivate user:", err);
    }
  };

  return (
    <AdminPanelTemplate
      title="All Users"
      columns={[
        { label: "Name" },
        { label: "Email" },
        { label: "Role" },
        { label: "Actions", align: "right" },
      ]}
    >
      {Array.isArray(userList) && userList.length > 0 ? (
        userList.map((user) => (
          <AdminUserRow
            key={user._id}
            user={user}
            onToggleRole={handleRoleChange}
            onDeactivate={handleDeactivate}
            onReactivate={handleReactivate}
          />
        ))
      ) : (
        <tr>
          <td colSpan={4} className="text-center py-6 text-muted-foreground">
            No users found
          </td>
        </tr>
      )}
    </AdminPanelTemplate>
  );
}

export default AdminUsersView;
