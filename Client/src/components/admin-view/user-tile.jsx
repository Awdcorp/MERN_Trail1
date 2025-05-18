// ✅ AdminUserRow.jsx with Edit button added without UI changes
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

function AdminUserRow({ user, onToggleRole, onDeactivate, onReactivate, onEdit }) {
  const isInactive = user.isActive === false;

  return (
    <tr key={user._id} className={`border-t ${isInactive ? "opacity-50" : ""}`}>
      <td className="px-3 py-2">{user.userName}</td>
      <td className="px-3 py-2">{user.email}</td>
      <td className="px-3 py-2">
        <Badge>{user.role}</Badge>
      </td>
      <td className="px-3 py-2 text-right space-x-2">
        <Button size="sm" variant="outline" onClick={() => onEdit(user)}>
          Edit
        </Button>

        <Button
          size="sm"
          onClick={() => onToggleRole(user._id, user.role)}
          disabled={isInactive}
        >
          Toggle Role
        </Button>

        {isInactive ? (
          <Button size="sm" onClick={() => onReactivate(user._id)}>
            Reactivate
          </Button>
        ) : (
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDeactivate(user._id)}
          >
            Deactivate
          </Button>
        )}
      </td>
    </tr>
  );
}

export default AdminUserRow;
