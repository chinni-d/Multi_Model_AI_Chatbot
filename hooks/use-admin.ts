import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export interface UserData {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "admin" | "user";
  isActive: boolean;
  lastSeen: string;
  joinDate: string;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  adminUsers: number;
  newUsersToday: number;
}

export function useAdminData() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserData[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if user is admin
  const isAdmin =
    user?.emailAddresses?.[0]?.emailAddress?.includes("admin") ||
    user?.publicMetadata?.role === "admin";

  useEffect(() => {
    const fetchAdminData = async () => {
      if (!user || !isAdmin) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch users from our API route
        const response = await fetch("/api/admin/users");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const { users: fetchedUsers } = await response.json();
        const transformedUsers: UserData[] = fetchedUsers;

        // Calculate stats
        const now = new Date();
        const todayStart = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );

        const adminUsers = transformedUsers.filter((u) => u.role === "admin");
        const activeUsers = transformedUsers.filter((u) => u.isActive);
        const newUsersToday = transformedUsers.filter(
          (u) => new Date(u.joinDate) >= todayStart
        );

        const calculatedStats: AdminStats = {
          totalUsers: transformedUsers.length,
          activeUsers: activeUsers.length,
          adminUsers: adminUsers.length,
          newUsersToday: newUsersToday.length,
        };

        setUsers(transformedUsers);
        setStats(calculatedStats);
      } catch (err) {
        console.error("Error fetching admin data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch admin data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [user, isAdmin]);

  const refreshData = async () => {
    if (!user || !isAdmin) return;

    setLoading(true);
    setError(null);

    try {
      // Re-fetch users from our API route
      const response = await fetch("/api/admin/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const { users: fetchedUsers } = await response.json();
      const transformedUsers: UserData[] = fetchedUsers;

      // Calculate stats
      const now = new Date();
      const todayStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );

      const adminUsers = transformedUsers.filter((u) => u.role === "admin");
      const activeUsers = transformedUsers.filter((u) => u.isActive);
      const newUsersToday = transformedUsers.filter(
        (u) => new Date(u.joinDate) >= todayStart
      );

      const calculatedStats: AdminStats = {
        totalUsers: transformedUsers.length,
        activeUsers: activeUsers.length,
        adminUsers: adminUsers.length,
        newUsersToday: newUsersToday.length,
      };

      setUsers(transformedUsers);
      setStats(calculatedStats);
    } catch (err) {
      console.error("Error refreshing admin data:", err);
      setError(err instanceof Error ? err.message : "Failed to refresh data");
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    isAdmin,
    loading,
    users,
    stats,
    error,
    refreshData,
  };
}
