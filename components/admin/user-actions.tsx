"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  MoreHorizontal,
  UserMinus,
  Shield,
  ShieldOff,
  Loader2,
  RotateCcw,
} from "lucide-react";
import { UserData } from "@/hooks/use-admin";
import { toast } from "@/hooks/use-toast";

interface UserActionsProps {
  user: UserData;
  onUserUpdate?: (userId: string, updates: Partial<UserData>) => void;
}

export function UserActions({ user, onUserUpdate }: UserActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPromoteDialog, setShowPromoteDialog] = useState(false);
  const [showDemoteDialog, setShowDemoteDialog] = useState(false);
  const [showResetCountsDialog, setShowResetCountsDialog] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handlePromoteUser = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/users/${user.id}/promote`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to promote user");
      }

      onUserUpdate?.(user.id, { role: "admin" });
      setShowPromoteDialog(false);
      toast({
        title: "User promoted",
        description: `${user.name} has been promoted to admin.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to promote user.",
        variant: "destructive",
      });
      console.error("Error promoting user:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDemoteUser = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/users/${user.id}/demote`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to demote user");
      }

      onUserUpdate?.(user.id, { role: "user" });
      setShowDemoteDialog(false);
      toast({
        title: "User demoted",
        description: `${user.name} has been demoted to regular user.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to demote user.",
        variant: "destructive",
      });
      console.error("Error demoting user:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleResetCounts = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/users/${user.id}/reset-counts`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to reset counts");
      }

      onUserUpdate?.(user.id, { requestCount: 0, responseCount: 0 });
      setShowResetCountsDialog(false);
      toast({
        title: "Counts reset",
        description: `Message counts for ${user.name} have been reset to 0.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset message counts.",
        variant: "destructive",
      });
      console.error("Error resetting counts:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteUser = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      setShowDeleteDialog(false);
      toast({
        title: "User deleted",
        description: `${user.name} has been deleted.`,
        variant: "destructive",
      });
      // Trigger a refresh of the user list
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user.",
        variant: "destructive",
      });
      console.error("Error deleting user:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 hover:bg-background/80"
            disabled={isUpdating}
          >
            <span className="sr-only">Open menu</span>
            {isUpdating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MoreHorizontal className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="bg-background/95 backdrop-blur-sm border border-border/50"
        >
          {user.role === "user" ? (
            <DropdownMenuItem
              onClick={() => setShowPromoteDialog(true)}
              disabled={isUpdating}
              className="hover:bg-background/80"
            >
              <Shield className="mr-2 h-4 w-4" />
              Promote to Admin
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => setShowDemoteDialog(true)}
              disabled={isUpdating}
              className="hover:bg-background/80"
            >
              <ShieldOff className="mr-2 h-4 w-4" />
              Demote to User
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setShowResetCountsDialog(true)}
            disabled={isUpdating}
            className="hover:bg-background/80"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset Message Counts
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-red-600 focus:text-red-600 hover:bg-red-50/50 dark:hover:bg-red-900/20"
            disabled={isUpdating}
          >
            <UserMinus className="mr-2 h-4 w-4" />
            Delete User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-background/95 backdrop-blur-sm border border-border/50">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              {user.name}'s account and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-background/50 backdrop-blur-sm border-border/50 hover:bg-background/70">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-red-600 hover:bg-red-700 min-w-[100px]"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <UserMinus className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Promote confirmation dialog */}
      <AlertDialog open={showPromoteDialog} onOpenChange={setShowPromoteDialog}>
        <AlertDialogContent className="bg-background/95 backdrop-blur-sm border border-border/50">
          <AlertDialogHeader>
            <AlertDialogTitle>Promote User to Admin</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to promote {user.name} to admin? This will
              give them full administrative privileges.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-background/50 backdrop-blur-sm border-border/50 hover:bg-background/70">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePromoteUser}
              disabled={isUpdating}
              className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-[100px]"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Promoting...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Promote
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Demote confirmation dialog */}
      <AlertDialog open={showDemoteDialog} onOpenChange={setShowDemoteDialog}>
        <AlertDialogContent className="bg-background/95 backdrop-blur-sm border border-border/50">
          <AlertDialogHeader>
            <AlertDialogTitle>Demote Admin to User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to demote {user.name} from admin? This will
              remove their administrative privileges.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-background/50 backdrop-blur-sm border-border/50 hover:bg-background/70">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDemoteUser}
              disabled={isUpdating}
              className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-[100px]"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Demoting...
                </>
              ) : (
                <>
                  <ShieldOff className="mr-2 h-4 w-4" />
                  Demote
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset Counts confirmation dialog */}
      <AlertDialog open={showResetCountsDialog} onOpenChange={setShowResetCountsDialog}>
        <AlertDialogContent className="bg-background/95 backdrop-blur-sm border border-border/50">
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Message Counts</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reset the message counts for {user.name}? 
              This will set both request count and response count to 0. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-background/50 backdrop-blur-sm border-border/50 hover:bg-background/70">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleResetCounts}
              disabled={isUpdating}
              className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-[100px]"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                <>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset Counts
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
