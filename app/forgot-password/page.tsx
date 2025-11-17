"use client";

import type React from "react";

import { useState } from "react";
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
import { Mail, AlertCircle, Sparkles, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { forgotPassword } from "@/api/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setIsLoading(true);
      await forgotPassword({ email });
      setSuccess(true);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError("Failed to send reset link. Please try again.");
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
              Session Share
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-muted-foreground mt-2 text-balance"
            >
              {success
                ? "Check your email for the reset link"
                : "No worries, we'll send you reset instructions"}
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
                    {success ? "Email Sent!" : "Forgot Password?"}
                  </CardTitle>
                  <CardDescription className="text-center text-muted-foreground">
                    {success
                      ? "We've sent a password reset link to your email"
                      : "Enter your email address and we'll send you a link to reset your password"}
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
                          A password reset link has been sent to{" "}
                          <strong>{email}</strong>. Please check your inbox and
                          follow the instructions.
                        </AlertDescription>
                      </Alert>

                      <div className="text-sm text-muted-foreground space-y-2">
                        <p>Didn't receive the email?</p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>Check your spam or junk folder</li>
                          <li>Make sure you entered the correct email</li>
                          <li>Wait a few minutes and check again</li>
                        </ul>
                      </div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          onClick={() => {
                            setSuccess(false);
                            setEmail("");
                          }}
                          variant="outline"
                          className="w-full h-11 border-border/50 hover:bg-accent/5 hover:border-accent/30 transition-all duration-200"
                        >
                          Try Another Email
                        </Button>
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
                          <Label htmlFor="email" className="text-sm font-medium">
                            Email Address
                          </Label>
                          <div className="relative group">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                              id="email"
                              type="email"
                              placeholder="Enter your email"
                              value={email}
                              onChange={(e) => {
                                setEmail(e.target.value);
                                setError("");
                              }}
                              className="pl-10 h-11 border-border/50 focus:border-primary/50 transition-all duration-200"
                              required
                            />
                          </div>
                        </motion.div>

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
                              "Send Reset Link"
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
                      <ArrowLeft className="h-4 w-4" />
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

