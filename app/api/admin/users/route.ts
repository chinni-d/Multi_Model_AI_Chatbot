import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { getAllUsersStats } from "@/lib/db";

interface UserStats {
  clerkId: string;
  requestCount: number;
  responseCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export async function GET() {
  try {
    // Check if user is authenticated and is admin
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the current user to check admin status
    const client = await clerkClient();
    const currentUser = await client.users.getUser(userId);
    const isAdmin =
      currentUser.emailAddresses[0]?.emailAddress?.includes("admin") ||
      currentUser.publicMetadata?.role === "admin" ||
      currentUser.publicMetadata?.role === "super_admin";

    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch all users with pagination
    let allUsers: any[] = [];
    let hasMore = true;
    let offset = 0;
    const limit = 100; // Fetch in batches of 100

    while (hasMore) {
      const clerkUsersPage = await client.users.getUserList({
        limit,
        offset,
      });

      allUsers = [...allUsers, ...clerkUsersPage.data];
      hasMore = clerkUsersPage.data.length === limit;
      offset += limit;
    }

    // Get message counts for all users
    const userStats = await getAllUsersStats();
    const userStatsMap = new Map<string, UserStats>(
      userStats.map((stat: UserStats) => [stat.clerkId, stat])
    );

    // Transform Clerk users to our UserData format
    const users = allUsers.map((clerkUser: any) => {
      const stats = userStatsMap.get(clerkUser.id);

      return {
        id: clerkUser.id,
        name:
          clerkUser.fullName ||
          `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
          "Unknown User",
        email: clerkUser.emailAddresses[0]?.emailAddress || "No email",
        avatar: clerkUser.imageUrl || "",
        role:
          (clerkUser.publicMetadata?.role as "admin" | "super_admin" | "user") ||
          (clerkUser.emailAddresses[0]?.emailAddress?.includes("admin")
            ? "admin"
            : "user"),
        isActive:
          !clerkUser.banned &&
          (clerkUser.lastActiveAt
            ? new Date(clerkUser.lastActiveAt).getTime() >
              Date.now() - 7 * 24 * 60 * 60 * 1000
            : true),
        lastSeen: clerkUser.lastActiveAt || clerkUser.createdAt,
        joinDate: clerkUser.createdAt,
        requestCount: stats?.requestCount ?? 0,
        responseCount: stats?.responseCount ?? 0,
        statsCreatedAt: stats?.createdAt ?? null,
        statsUpdatedAt: stats?.updatedAt ?? null,
      };
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
