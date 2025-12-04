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
      currentUser.publicMetadata?.role === "admin";

    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get user details for email
    const userToDemote = await client.users.getUser(userId);
    const userEmail = userToDemote.emailAddresses[0]?.emailAddress;
    const userName = userToDemote.firstName 
      ? `${userToDemote.firstName} ${userToDemote.lastName || ''}`.trim() 
      : 'User';

    // Demote user to regular user
    await client.users.updateUserMetadata(userId, {
      publicMetadata: { role: "user" },
    });

    if (userEmail) {
      console.log('Sending demote email to:', userEmail, 'Name:', userName);
      const { sendDemoteEmail } = await import("@/lib/mail");
      await sendDemoteEmail(userEmail, userName);
    } else {
      console.warn('No email found for user:', userId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error demoting user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
