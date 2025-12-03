"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  UserCheck,
  Activity,
  MessageSquare,
  Shield,
  RefreshCw,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminData, UserData } from "@/hooks/use-admin";
import { UserActions } from "@/components/admin/user-actions";
import { Toaster } from "@/components/ui/toaster";

export default function AdminPanel() {
  const { user, isAdmin, loading, users, stats, error, refreshData, isLoaded } =
    useAdminData();
  const [filter, setFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const [localUsers, setLocalUsers] = useState<UserData[]>([]);

  // Update local users when data changes
  useEffect(() => {
    setLocalUsers(users);
  }, [users]);

  const handleUserUpdate = (userId: string, updates: Partial<UserData>) => {
    setLocalUsers((prev) =>
      prev.map((user) => (user.id === userId ? { ...user, ...updates } : user))
    );
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48 bg-muted/30" />
            <Skeleton className="h-4 w-96 bg-muted/20" />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="bg-background/30 backdrop-blur-sm border border-border/30">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10 rounded-lg bg-muted/40" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-20 bg-muted/40" />
                      <Skeleton className="h-8 w-16 bg-muted/50" />
                      <Skeleton className="h-3 w-24 bg-muted/30" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="bg-background/30 backdrop-blur-sm border border-border/30">
            <CardHeader>
              <div className="space-y-2">
                <Skeleton className="h-6 w-32 bg-muted/40" />
                <Skeleton className="h-4 w-48 bg-muted/30" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full bg-muted/20" />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-background/50 backdrop-blur-sm border border-border/50">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Please sign in to access the admin panel.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-background/50 backdrop-blur-sm border border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-2">
              <Shield className="h-6 w-6 text-red-500" />
              <p className="text-center text-muted-foreground">
                Access denied. Admin privileges required.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-background/50 backdrop-blur-sm border border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-2">
              <p className="text-center text-red-500">Error: {error}</p>
              <Button
                onClick={handleRefresh}
                size="sm"
                variant="outline"
                disabled={refreshing}
                className={`bg-background/50 backdrop-blur-sm border-border/50 transition-all duration-200 ${
                  refreshing ? "opacity-80 cursor-not-allowed" : ""
                }`}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 transition-transform duration-200 ${
                    refreshing ? "animate-spin" : ""
                  }`}
                />
                {refreshing ? "Retrying..." : "Retry"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredUsers = localUsers.filter((user) => {
    if (filter === "all") return true;
    if (filter === "admin") return user.role === "admin";
    if (filter === "users") return user.role === "user";
    if (filter === "active") return user.isActive;
    return true;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // if (!stats) return null; // Removed to allow rendering while loading

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
              <p className="text-muted-foreground">
                Manage users and view chatbot statistics
              </p>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              variant="outline"
              size="sm"
              className={`bg-background/50 backdrop-blur-sm border-border/50 hover:bg-background/70 transition-all duration-200 ${
                refreshing ? "opacity-80 cursor-not-allowed" : ""
              }`}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 transition-transform ${
                  refreshing ? "animate-spin" : ""
                }`}
                style={{ animationDuration: refreshing ? "2s" : undefined }}
              />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-background/50 backdrop-blur-sm border border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Users
                  </p>
                  <div className="text-2xl font-bold">
                    {loading || refreshing ? (
                      <Skeleton className="h-8 w-16 bg-muted/50" />
                    ) : (
                      stats?.totalUsers ?? 0
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {loading || refreshing ? (
                      <>
                        +
                        <Skeleton className="inline h-3 w-6 bg-muted/30 mx-1" />{" "}
                        new today
                      </>
                    ) : (
                      `+${stats?.newUsersToday ?? 0} new today`
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background/50 backdrop-blur-sm border border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Users
                  </p>
                  <div className="text-2xl font-bold">
                    {loading || refreshing ? (
                      <Skeleton className="h-8 w-16 bg-muted/50" />
                    ) : (
                      stats?.activeUsers ?? 0
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {loading || refreshing ? (
                      <>
                        <Skeleton className="inline h-3 w-8 bg-muted/30 mr-1" />
                        % of total
                      </>
                    ) : (
                      `${Math.round(
                        ((stats?.activeUsers ?? 0) / (stats?.totalUsers || 1)) * 100
                      )}% of total`
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background/50 backdrop-blur-sm border border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <UserCheck className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Admin Users
                  </p>
                  <div className="text-2xl font-bold">
                    {loading || refreshing ? (
                      <Skeleton className="h-8 w-16 bg-muted/50" />
                    ) : (
                      stats?.adminUsers ?? 0
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {loading || refreshing ? (
                      <>
                        <Skeleton className="inline h-3 w-8 bg-muted/30 mr-1" />
                        % of total
                      </>
                    ) : (
                      `${Math.round(
                        ((stats?.adminUsers ?? 0) / (stats?.totalUsers || 1)) * 100
                      )}% of total`
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card className="bg-background/50 backdrop-blur-sm border border-border/50">
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  View and manage all users in your system
                </CardDescription>
                <div className="flex space-x-2">
                  <Button
                    variant={filter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("all")}
                  >
                    All ({loading || refreshing ? "..." : localUsers.length})
                  </Button>
                  <Button
                    variant={filter === "admin" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("admin")}
                  >
                    Admins (
                    {loading || refreshing
                      ? "..."
                      : localUsers.filter((u) => u.role === "admin").length}
                    )
                  </Button>
                  <Button
                    variant={filter === "users" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("users")}
                  >
                    Users (
                    {loading || refreshing
                      ? "..."
                      : localUsers.filter((u) => u.role === "user").length}
                    )
                  </Button>
                  <Button
                    variant={filter === "active" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("active")}
                  >
                    Active (
                    {loading || refreshing
                      ? "..."
                      : localUsers.filter((u) => u.isActive).length}
                    )
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Seen</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead className="w-[50px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading || refreshing ? (
                      [...Array(5)].map((_, i) => (
                        <TableRow key={i}>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Skeleton className="h-8 w-8 rounded-full bg-muted/40" />
                              <div className="space-y-1">
                                <Skeleton className="h-4 w-24 bg-muted/40" />
                                <Skeleton className="h-3 w-32 bg-muted/30" />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-5 w-16 bg-muted/40" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-5 w-16 bg-muted/40" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-24 bg-muted/30" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-20 bg-muted/30" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-8 w-8 bg-muted/40" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <Users className="h-8 w-8 text-muted-foreground" />
                            <p className="text-muted-foreground">
                              {filter === "all"
                                ? "No users found"
                                : `No ${filter} users found`}
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={user.avatar}
                                  alt={user.name}
                                />
                                <AvatarFallback>
                                  {user.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                user.role === "admin" ? "default" : "secondary"
                              }
                            >
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={user.isActive ? "default" : "outline"}
                            >
                              {user.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatTime(user.lastSeen)}</TableCell>
                          <TableCell>{formatDate(user.joinDate)}</TableCell>
                          <TableCell>
                            <UserActions
                              user={user}
                              onUserUpdate={handleUserUpdate}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4">
              <Card className="bg-background/50 backdrop-blur-sm border border-border/50">
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                  <CardDescription>
                    User data from Clerk authentication
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total Users</span>
                      <span className="text-sm text-muted-foreground">
                        {loading || refreshing ? (
                          <Skeleton className="h-4 w-8 bg-muted/40" />
                        ) : (
                          stats?.totalUsers ?? 0
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        New Users Today
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {loading || refreshing ? (
                          <Skeleton className="h-4 w-8 bg-muted/40" />
                        ) : (
                          stats?.newUsersToday ?? 0
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Active Rate</span>
                      <span className="text-sm text-muted-foreground">
                        {loading || refreshing ? (
                          <Skeleton className="h-4 w-12 bg-muted/40" />
                        ) : (
                          `${Math.round(
                            ((stats?.activeUsers ?? 0) / (stats?.totalUsers || 1)) *
                              100
                          )}%`
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </div>
  );
}
