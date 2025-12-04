import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
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
      currentUser.publicMetadata?.role === "admin" ||
      currentUser.publicMetadata?.role === "super_admin";

    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get user details for email
    const userToPromote = await client.users.getUser(userId);
    const userEmail = userToPromote.emailAddresses[0]?.emailAddress;
    const userName = userToPromote.firstName 
      ? `${userToPromote.firstName} ${userToPromote.lastName || ''}`.trim() 
      : 'User';

    // Promote user to admin
    await client.users.updateUserMetadata(userId, {
      publicMetadata: { role: "admin" },
    });

    if (userEmail) {
      console.log('Sending promote email to:', userEmail, 'Name:', userName);
      const { sendPromoteEmail } = await import("@/lib/mail");
      await sendPromoteEmail(userEmail, userName);
    } else {
      console.warn('No email found for user:', userId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error promoting user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
