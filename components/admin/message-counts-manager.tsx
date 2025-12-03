"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCcw, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function MessageCountsManager() {
  const [showResetAllDialog, setShowResetAllDialog] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleResetAllCounts = async () => {
    setIsResetting(true);
    try {
      const response = await fetch("/api/admin/reset-all-counts", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to reset all counts");
      }

      setShowResetAllDialog(false);
      toast({
        title: "All counts reset",
        description: "Message counts for all users have been reset to 0.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset message counts.",
        variant: "destructive",
      });
      console.error("Error resetting all counts:", error);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Message Count Management</CardTitle>
          <CardDescription>
            Manage user message tracking counts. This system tracks how many messages users send (requests) 
            and how many responses they receive from the AI.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="text-sm font-medium">Reset All User Counts</h4>
                <p className="text-sm text-muted-foreground">
                  This will reset message counts to 0 for all users in the system.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowResetAllDialog(true)}
                disabled={isResetting}
                className="ml-4"
              >
                {isResetting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  <>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset All
                  </>
                )}
              </Button>
            </div>

            <div className="text-sm text-muted-foreground space-y-2">
              <p><strong>How it works:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Every time a user sends a message, their request count increases by 1</li>
                <li>Every time the AI responds, their response count increases by 1</li>
                <li>Counts can be reset individually per user or globally for all users</li>
                <li>Data is stored securely in the database using Clerk user IDs</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reset All confirmation dialog */}
      <AlertDialog open={showResetAllDialog} onOpenChange={setShowResetAllDialog}>
        <AlertDialogContent className="bg-background/95 backdrop-blur-sm border border-border/50">
          <AlertDialogHeader>
            <AlertDialogTitle>Reset All Message Counts</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reset message counts for ALL users? 
              This will set both request count and response count to 0 for every user in the system.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-background/50 backdrop-blur-sm border-border/50 hover:bg-background/70">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleResetAllCounts}
              disabled={isResetting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 min-w-[120px]"
            >
              {isResetting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                <>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset All
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}