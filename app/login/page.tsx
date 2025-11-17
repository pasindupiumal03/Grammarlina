"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Mail, Lock, AlertCircle, Sparkles } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { setAuth, setIsLoading, authSelector } from "@/lib/slices/auth-slice";
import {
  inviteSelector,
  setInviteData,
  clearInviteData,
} from "@/lib/slices/invite-slice";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";
import { getUser, login, googleAuth } from "@/api/auth";
import { useSelector } from "react-redux";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const inviteState = useAppSelector(inviteSelector);
  const [inviteDismissed, setInviteDismissed] = useState(false);
  const isInviteFlow = !!inviteState.email && !inviteDismissed;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const authState = useSelector(authSelector);
  const isLoading = authState.isLoading;

  // Check for invite params in URL and store them
  useEffect(() => {
    const inviteCode = searchParams.get("invite") || searchParams.get("code");
    const emailParam = searchParams.get("email");
    const org = searchParams.get("org");
    
    // If all invite params are present in URL, store them in Redux
    if (inviteCode && emailParam && org && !inviteState.email) {
      dispatch(
        setInviteData({
          inviteCode,
          email: decodeURIComponent(emailParam),
          org,
        })
      );
    }
  }, [searchParams, inviteState.email, dispatch]);

  // Pre-fill email from invite if exists
  useEffect(() => {
    if (inviteState.email && !email) {
      setEmail(inviteState.email);
    }
  }, [inviteState.email]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      dispatch(setIsLoading(true));
      const loginResponse = await login({ email, password });
      const { user, token } = loginResponse;
      dispatch(
        setAuth({
          _id: user._id,
          authToken: token,
          email: user.email,
          name: user.name,
          organizations: user.organizations,
          accountCreatedAt: new Date(user.createdAt).toISOString(),
        })
      );
      dispatch(setIsLoading(false));

      // If this is an invite flow, redirect to accept-invite page
      if (isInviteFlow && inviteState.inviteCode && inviteState.org) {
        router.push(
          `/invites/accept?invite=${
            inviteState.inviteCode
          }&email=${encodeURIComponent(inviteState.email!)}&org=${
            inviteState.org
          }`
        );
        return;
      }

      //if no organizations found, create one
      if (user.organizations.length === 0) {
        router.push("/create-organization");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      dispatch(setIsLoading(false));
      if (err.message?.includes("Invalid credentials"))
        return setError("Invalid email or password. Please try again.");
      setError(err.message || "Invalid email or password. Please try again.");
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        dispatch(setIsLoading(true));

        // Get Google ID token by exchanging the access token
        const idTokenResponse = await fetch(
          `https://oauth2.googleapis.com/tokeninfo?access_token=${tokenResponse.access_token}`
        );

        if (!idTokenResponse.ok) {
          throw new Error("Failed to get Google user info");
        }

        // Send the access token to your backend
        const response = await googleAuth(tokenResponse.access_token);

        if (response.success) {
          dispatch(
            setAuth({
              ...response.user,
              authToken: response.token,
            })
          );

          // If this is an invite flow, redirect to accept-invite page
          if (isInviteFlow && inviteState.inviteCode && inviteState.org) {
            router.push(
              `/accept-invite?invite=${
                inviteState.inviteCode
              }&email=${encodeURIComponent(inviteState.email!)}&org=${
                inviteState.org
              }`
            );
            return;
          }

          // Check if user needs to create an organization
          if (response.user.organizations.length === 0) {
            router.push("/create-organization");
          } else {
            router.push("/dashboard");
          }
        } else {
          setError(
            response.message || "Google login failed. Please try again."
          );
        }
      } catch (err) {
        console.error("Google Auth Error:", err);
        setError(
          (err as Error).message || "Google login failed. Please try again."
        );
      } finally {
        dispatch(setIsLoading(false));
      }
    },
    onError: () => {
      setError("Google login failed. Please try again.");
    },
  });

  useEffect(() => {
    const autoLoginUser = async () => {
      try {
        dispatch(setIsLoading(true));
        const userResponse = await getUser();
        if (userResponse.success) {
          dispatch(
            setAuth({
              ...userResponse.user,
            })
          );
          if (isInviteFlow && inviteState.inviteCode && inviteState.org) {
            router.push(
              `/invites/accept?invite=${
                inviteState.inviteCode
              }&email=${encodeURIComponent(inviteState.email!)}&org=${
                inviteState.org
              }`
            );
            return;
          }
          router.push("/dashboard");
        }
        dispatch(setIsLoading(false));
      } catch (error) {
        dispatch(setIsLoading(false));
      }
    };

    autoLoginUser();
  }, []);

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
        className="w-full max-w-5xl mx-auto relative z-10"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
          <div className="md:w-1/2 text-center  mb-8 md:mb-0">
            <motion.div
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
              className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 shadow-lg"
            >
              <img src="logo.png" alt="" />
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
              className="text-3xl font-bold text-foreground bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text"
            >
              Session Share
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-muted-foreground mt-2 text-balance"
            >
              Welcome back! Please sign in to your account.
            </motion.p>
          </div>
          <div className="md:w-1/2 w-full flex justify-center md:justify-end">
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="w-full max-w-md"
            >
              <Card className="border-border/50 shadow-xl backdrop-blur-sm bg-card/95 card-hover">
                <CardHeader className="space-y-1 pb-4">
                  <CardTitle className="text-2xl font-semibold text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Sign In
                  </CardTitle>
                  <CardDescription className="text-center text-muted-foreground">
                    Enter your credentials to access your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isInviteFlow && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.3, type: "spring" }}
                    >
                      <Alert className="border-blue-500/20 bg-blue-500/5">
                        <AlertCircle className="h-4 w-4 text-blue-500" />
                        <AlertDescription className="text-blue-700 dark:text-blue-400 flex flex-col gap-2">
                          <span>
                            You're signing in with an organization invitation.
                            Please use the email address:{" "}
                            <strong>{inviteState.email}</strong>
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setInviteDismissed(true);
                              dispatch(clearInviteData());
                              setEmail("");
                            }}
                            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline text-left w-fit transition-colors"
                          >
                            Not you? Sign in without invitation
                          </button>
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                  )}

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.3, type: "spring" }}
                    >
                      <Alert
                        variant="destructive"
                        className="border-destructive/20 bg-destructive/5"
                      >
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    </motion.div>
                  )}

                  <form onSubmit={handleLogin} className="space-y-5">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email{" "}
                        {isInviteFlow && (
                          <span className="text-xs text-muted-foreground">
                            (from invitation)
                          </span>
                        )}
                      </Label>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={isInviteFlow}
                          className="pl-10 h-11 border-border/50 focus:border-primary/50 transition-all duration-200 disabled:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-100"
                          required
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="password" className="text-sm font-medium">
                        Password
                      </Label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 pr-10 h-11 border-border/50 focus:border-primary/50 transition-all duration-200"
                          required
                        />
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-muted-foreground hover:text-primary transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </motion.button>
                      </div>
                    </motion.div>

                    <div className="flex items-center justify-between">
                      <Link
                        href="/forgot-password"
                        className="text-sm text-accent hover:text-accent/80 transition-colors font-medium"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full text-white h-11 rounded-md font-medium shadow-lg border-0 transition-all duration-200 hover:opacity-90 disabled:opacity-50"
                        style={{
                          background:
                            "linear-gradient(135deg, #1e40af 0%, #3730a3 100%) !important",
                          color: "white !important",
                          backgroundImage:
                            "linear-gradient(135deg, #1e40af 0%, #3730a3 100%)",
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
                          "Sign In"
                        )}
                      </button>
                    </motion.div>
                  </form>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border/30" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-3 text-muted-foreground font-medium">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      onClick={() => handleGoogleLogin()}
                      disabled={isLoading}
                      className="w-full h-11 bg-transparent border-border/50 hover:bg-accent/5 hover:border-accent/30 transition-all duration-200 hover:text-black"
                    >
                      <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Continue with Google
                    </Button>
                  </motion.div>

                  <div className="text-center text-sm">
                    <span className="text-muted-foreground">
                      Don't have an account?{" "}
                    </span>
                    <Link
                      href="/register"
                      className="text-accent hover:text-accent/80 font-semibold transition-colors"
                    >
                      Create account
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
