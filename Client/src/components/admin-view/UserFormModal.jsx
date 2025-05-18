// ✅ UserFormModal.jsx
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

function UserFormModal({ open, onClose, onSave, user }) {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    role: "user",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        userName: user.userName,
        email: user.email,
        password: "",
        role: user.role,
        _id: user._id,
      });
    } else {
      setFormData({ userName: "", email: "", password: "", role: "user" });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Add New User"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="userName">Username</Label>
            <Input name="userName" value={formData.userName} onChange={handleChange} required />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input name="email" type="email" value={formData.email} onChange={handleChange} required />
          </div>

          {!user && (
            <div>
              <Label htmlFor="password">Password</Label>
              <Input name="password" type="password" value={formData.password} onChange={handleChange} required />
            </div>
          )}

          <div>
            <Label>Role</Label>
            <Select value={formData.role} onValueChange={(val) => setFormData(prev => ({ ...prev, role: val }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit">{user ? "Update" : "Create"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default UserFormModal;
