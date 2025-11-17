"use client";

import type React from "react";

import { useState, useEffect } from "react";
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
import { Lock, AlertCircle, Sparkles, CheckCircle2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "@/api/auth";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Extract token and email from URL parameters
  useEffect(() => {
    const tokenParam = searchParams.get("token");
    const emailParam = searchParams.get("email");
    
    if (tokenParam) {
      setToken(tokenParam);
    }
    
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }

    // Check if required params are missing
    if (!tokenParam || !emailParam) {
      setError("Invalid reset link. Please request a new password reset.");
    }
  }, [searchParams]);

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/(?=.*\d)/.test(password)) {
      return "Password must contain at least one number";
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate passwords
    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!token || !email) {
      setError("Invalid reset link. Please request a new password reset.");
      return;
    }

    try {
      setIsLoading(true);
      await resetPassword({
        email,
        token,
        newPassword,
      });
      setSuccess(true);
      setIsLoading(false);
      
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (err: any) {
      setIsLoading(false);
      setError(
        err?.message || "Failed to reset password. The link may have expired. Please try again."
      );
    }
  };

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
          <div className="md:w-1/2 text-center mb-8 md:mb-0">
            <motion.div
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
              className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 shadow-lg"
            >
              <img src="/logo.png" alt="" />
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
              Grammarlina
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-muted-foreground mt-2 text-balance"
            >
              {success
                ? "Password reset successful!"
                : "Create a new strong password for your account"}
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
                    {success ? "Success!" : "Reset Password"}
                  </CardTitle>
                  <CardDescription className="text-center text-muted-foreground">
                    {success
                      ? "Your password has been reset successfully"
                      : email
                      ? `Resetting password for ${email}`
                      : "Enter your new password below"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {success ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, type: "spring" }}
                      className="space-y-4"
                    >
                      <Alert className="border-green-500/20 bg-green-500/5">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <AlertDescription className="text-green-700 dark:text-green-400">
                          Your password has been changed successfully. You can now
                          sign in with your new password.
                        </AlertDescription>
                      </Alert>

                      <div className="text-sm text-muted-foreground text-center">
                        <p>Redirecting to login page in a few seconds...</p>
                      </div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Link href="/">
                          <Button
                            variant="default"
                            className="w-full h-11 text-white shadow-lg border-0 transition-all duration-200 hover:opacity-90"
                            style={{
                              background:
                                "linear-gradient(135deg, #1e40af 0%, #3730a3 100%)",
                              backgroundImage:
                                "linear-gradient(135deg, #1e40af 0%, #3730a3 100%)",
                            }}
                          >
                            Go to Sign In
                          </Button>
                        </Link>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <>
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

                      <form onSubmit={handleSubmit} className="space-y-5">
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
                          className="space-y-2"
                        >
                          <Label htmlFor="newPassword" className="text-sm font-medium">
                            New Password
                          </Label>
                          <div className="relative group">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                              id="newPassword"
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your new password"
                              value={newPassword}
                              onChange={(e) => {
                                setNewPassword(e.target.value);
                                setError("");
                              }}
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
                          <p className="text-xs text-muted-foreground">
                            Must be at least 8 characters with uppercase, lowercase, and number
                          </p>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                          className="space-y-2"
                        >
                          <Label htmlFor="confirmPassword" className="text-sm font-medium">
                            Confirm Password
                          </Label>
                          <div className="relative group">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                              id="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm your new password"
                              value={confirmPassword}
                              onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                setError("");
                              }}
                              className="pl-10 pr-10 h-11 border-border/50 focus:border-primary/50 transition-all duration-200"
                              required
                            />
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-3 text-muted-foreground hover:text-primary transition-colors"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </motion.button>
                          </div>
                        </motion.div>

                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <button
                            type="submit"
                            disabled={isLoading || !token || !email}
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
                              "Reset Password"
                            )}
                          </button>
                        </motion.div>
                      </form>
                    </>
                  )}

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border/30" />
                    </div>
                  </div>

                  <div className="text-center">
                    <Link
                      href="/"
                      className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors font-medium"
                    >
                      Back to Sign In
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

