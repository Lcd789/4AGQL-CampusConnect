// src/hooks/usePermissions.ts
import { useAuth } from "../context/AuthContext";

type Permission = "view_grades" | "edit_grades" | "view_class" | "edit_class" | "manage_users";

export const usePermissions = () => {
  const { user } = useAuth();

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;

    // Définition des permissions par rôle
    const rolePermissions: Record<string, Permission[]> = {
      student: ["view_grades", "view_class"],
      professor: ["view_grades", "edit_grades", "view_class", "edit_class"]
    };

    return rolePermissions[user.role]?.includes(permission) || false;
  };

  return { hasPermission };
};