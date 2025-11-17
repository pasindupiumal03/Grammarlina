"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Mail, Sparkles } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { authSelector, setAuth } from "@/lib/slices/auth-slice";
import {
  setInviteData,
  clearInviteData,
  inviteSelector,
} from "@/lib/slices/invite-slice";
import { acceptInvitation } from "@/api/organization";
import { getInviteInfo, getUser } from "@/api/auth";
// Removed NextAuth - no longer needed

export default function AcceptInvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const authState = useAppSelector(authSelector);
  const inviteState = useAppSelector(inviteSelector);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    // Clear invite data on page refresh
    const handleBeforeUnload = () => {
      dispatch(clearInviteData());
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [dispatch]);

  useEffect(() => {
    const validateInvite = async () => {
      try {
        // Handle new URL format: /invites/accept?code=xxx&org=xxx
        const inviteCode =
          searchParams.get("code") || searchParams.get("invite");
        const orgId = searchParams.get("org") as string;
        const inviteEmail = searchParams.get("email") as string;

        if (!inviteCode || !orgId) {
          setError("Invalid invitation link. Missing required parameters.");
          setIsValidating(false);
          return;
        }

        const userEmail = authState.email;
        const isUserAlreadyIn = authState.organizations.find(
          (org) => org._id === orgId
        );

        if (!userEmail) {
          dispatch(
            setInviteData({
              inviteCode,
              email: inviteEmail,
              org: orgId,
            })
          );
          return router.push("/");
        }

        const { invitation } = await getInviteInfo(inviteCode);
        if (!invitation || isUserAlreadyIn) {
          dispatch(clearInviteData());
          return router.push("/dashboard");
        }

        if (invitation.email !== userEmail) {
          console.log(userEmail);
          dispatch(clearInviteData());
          setError("Invalid invitation. Please check the link again.");
        }

        setIsValidating(false);
      } catch (error: any) {
        const message = error.message;
        setError(message);
        setIsValidating(false);
        dispatch(clearInviteData());
      }
    };

    validateInvite();
  }, [
    searchParams,
    authState.authToken,
    authState.email,
    authState.organizations,
    dispatch,
    router,
  ]);

  const handleAcceptInvite = async () => {
    const inviteCode = searchParams.get("code") || searchParams.get("invite");

    if (!inviteCode) {
      setError("Invalid invitation code.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      await acceptInvitation({ inviteCode });

      setSuccess(true);

      // Clear invite data
      dispatch(clearInviteData());

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err: any) {
      setIsLoading(false);
      setError(
        err?.message || "Failed to accept invitation. Please try again."
      );
    }
  };

  // If validating, show loading screen
  if (isValidating && !error) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Validating invitation...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -150, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-auto relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
            style={{
              background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
            }}
            className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 shadow-lg"
          >
            <span className="text-3xl font-bold text-white">SS</span>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="absolute -top-1 -right-1"
            >
              <Sparkles className="w-5 h-5 text-accent" />
            </motion.div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold text-foreground"
          >
            Organization Invitation
          </motion.h1>
        </div>

        <Card className="shadow-2xl backdrop-blur-sm bg-card/95 border-green-200/20">
          <CardHeader className="space-y-3 pb-6">
            <div className="flex justify-center mb-2">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <Mail className="w-3 h-3 text-green-600" />
                </div>
              </div>
            </div>
            {error && (
              <CardTitle className="text-xl font-semibold text-center bg-gradient-to-r from-destructive to-destructive/50 bg-clip-text text-transparent">
                Something's not right
              </CardTitle>
            )}
            {!error && (
              <CardTitle className="text-xl font-semibold text-center bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Accept Invitation
              </CardTitle>
            )}
            {!error && (
              <CardDescription className="text-center text-muted-foreground text-sm">
                You've been invited to join an organization
              </CardDescription>
            )}
            {error && (
              <CardDescription className="text-center text-muted-foreground text-sm">
                Something went wrong while finding your invitation
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                >
                  <Alert
                    variant="destructive"
                    className="border-destructive/20 bg-destructive/5"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Button
                    variant="outline"
                    onClick={() => router.push("/dashboard")}
                    className="w-full h-11 border-border/50 hover:border-border transition-colors"
                  >
                    Go to Dashboard
                  </Button>
                </motion.div>
              </>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
              >
                <Alert className="border-green-500/20 bg-green-500/5">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertDescription className="text-green-700 dark:text-green-400">
                    Invitation accepted successfully! Redirecting to
                    dashboard...
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            {!error && !success && (
              <div className="space-y-5">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100/50">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      Ready to Join
                    </p>
                    <p className="text-sm text-green-600">
                      Click below to accept this organization invitation
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handleAcceptInvite}
                      disabled={isLoading}
                      className="w-full h-12 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                      style={{
                        background:
                          "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
                      }}
                    >
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                          }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto"
                        />
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Accept Invitation
                        </>
                      )}
                    </Button>
                  </motion.div>

                  <Button
                    variant="outline"
                    onClick={() => router.push("/dashboard")}
                    disabled={isLoading}
                    className="w-full h-11 border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
