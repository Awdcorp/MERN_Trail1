// ✅ FIXED: AdminUsersView.jsx with logging added for save actions
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import AdminPanelTemplate from "@/components/admin-view/AdminPanelTemplate";
import AdminUserRow from "@/components/admin-view/user-tile";
import UserFormModal from "@/components/admin-view/UserFormModal";

function AdminUsersView() {
  const [userList, setUserList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);

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

  const handleRoleChange = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      console.log("🔄 Updating role:", { userId, newRole });
      await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/users/${userId}`, { role: newRole });
      fetchUsers();
    } catch (err) {
      console.error("❌ Failed to update role:", err);
    }
  };

  const handleDeactivate = async (userId) => {
    try {
      console.log("🚫 Deactivating user:", userId);
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/users/${userId}`);
      fetchUsers();
    } catch (err) {
      console.error("❌ Failed to deactivate user:", err);
    }
  };

  const handleReactivate = async (userId) => {
    try {
      console.log("✅ Reactivating user:", userId);
      await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/users/${userId}`, { isActive: true });
      fetchUsers();
    } catch (err) {
      console.error("❌ Failed to reactivate user:", err);
    }
  };

  const handleEdit = (user) => {
    console.log("✏️ Editing user:", user);
    setEditUser(user);
    setModalOpen(true);
  };

  const handleAdd = () => {
    console.log("➕ Opening Create User Modal");
    setEditUser(null);
    setModalOpen(true);
  };

  const handleSave = async (formData) => {
    console.log("💾 Saving user:", formData);
    try {
      if (formData._id) {
        console.log("📝 Sending PUT request to update user");
        await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/users/${formData._id}`, formData);
      } else {
        console.log("🆕 Sending POST request to create new user");
        await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/users`, formData);
      }
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      console.error("❌ Failed to save user:", err);
    }
  };

  return (
    <div className="px-4 pt-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">All Users</h2>
        <Button onClick={handleAdd}>+ Create User</Button>
      </div>

      <AdminPanelTemplate
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
              onEdit={handleEdit}
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

      <UserFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        user={editUser}
      />
    </div>
  );
}

export default AdminUsersView;
