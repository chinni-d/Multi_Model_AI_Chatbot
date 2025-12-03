import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId: currentUserId } = await auth();
    const { userId } = await params;

    if (!currentUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if current user is admin
    const client = await clerkClient();
    const currentUser = await client.users.getUser(currentUserId);
    const isAdmin =
      currentUser.emailAddresses[0]?.emailAddress?.includes("admin") ||
      currentUser.publicMetadata?.role === "admin";

    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete the user
    await client.users.deleteUser(userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
