import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

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
      currentUser.publicMetadata?.role === "admin";

    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch all users
    const clerkUsers = await client.users.getUserList();

    // Transform Clerk users to our UserData format
    const users = clerkUsers.data.map((clerkUser: any) => ({
      id: clerkUser.id,
      name:
        clerkUser.fullName ||
        `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
        "Unknown User",
      email: clerkUser.emailAddresses[0]?.emailAddress || "No email",
      avatar: clerkUser.imageUrl || "",
      role:
        (clerkUser.publicMetadata?.role as "admin" | "user") ||
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
    }));

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
