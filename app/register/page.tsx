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
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { authSelector, setAuth, setIsLoading } from "@/lib/slices/auth-slice";
import {
  inviteSelector,
  setInviteData,
  clearInviteData,
} from "@/lib/slices/invite-slice";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";
import { getUser, register, googleAuth, getMe } from "@/api/auth";
import { useSelector } from "react-redux";

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const inviteState = useAppSelector(inviteSelector);
  const [inviteDismissed, setInviteDismissed] = useState(false);
  const isInviteFlow = !!inviteState.email && !inviteDismissed;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isLoading = useSelector(authSelector).isLoading;
  const validForm =
    formData.agreeToTerms &&
    formData.name &&
    formData.email &&
    formData.password &&
    formData.confirmPassword;

  const rtkLoading = useAppSelector((s) => s.auth.isLoading);
  const authToken = useSelector(authSelector).authToken;

  // Check for invite params in URL and store them
  useEffect(() => {
    const inviteCode = searchParams.get("invite");
    const email = searchParams.get("email");
    const org = searchParams.get("org");

    // If all invite params are present in URL, store them in Redux
    // Only set if Redux doesn't already have invite data
    if (inviteCode && email && org && !inviteState.email) {
      dispatch(
        setInviteData({
          inviteCode,
          email: decodeURIComponent(email),
          org,
        })
      );
    }
  }, [searchParams, inviteState.email, dispatch]);

  // Pre-fill email from invite if exists
  useEffect(() => {
    if (inviteState.email && !formData.email) {
      setFormData((prev) => ({ ...prev, email: inviteState.email! }));
    }
  }, [inviteState.email]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.agreeToTerms) {
      newErrors.terms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      if (!validateForm()) return;

      dispatch(setIsLoading(true));

      const registerResponse = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      const { token, user } = registerResponse;

      try {
        dispatch(
          setAuth({
            _id: user._id,
            authToken: token,
            email: user.email,
            name: user.name,
            organizations: user.organizations,
            accountCreatedAt: new Date().toISOString(),
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

        const userResponse = await getMe();
        dispatch(
          setAuth({
            ...userResponse.user,
          })
        );

        const organizations = userResponse.user.organizations;
        if (organizations.length === 0)
          return router.push("/create-organization");
        router.push("/dashboard");
      } catch (err) {
        setErrors({ general: "Registration failed. Please try again." });
        dispatch(setIsLoading(false));
      } finally {
        dispatch(setIsLoading(false));
      }
    } catch (error) {
      setErrors({ general: "Registration failed. Please try again." });
    }
  };

  const handleGoogleRegister = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        dispatch(setIsLoading(true));
        const response = await googleAuth(tokenResponse.access_token);
        console.log(response);

        if (response.success) {
          dispatch(
            setAuth({
              ...response.user,
              authToken: response.token,
            })
          );

          // If in invite flow, redirect to accept-invite
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

          // Check if user needs to create an organization
          if (response.user.organizations.length === 0) {
            router.push("/create-organization");
          } else {
            router.push("/dashboard");
          }
        } else {
          setErrors({
            general:
              response.message ||
              "Google registration failed. Please try again.",
          });
        }
      } catch (err) {
        console.error("Google Auth Error:", err);
        setErrors({
          general:
            (err as Error).message ||
            "Google registration failed. Please try again.",
        });
      } finally {
        dispatch(setIsLoading(false));
      }
    },
    onError: () => {
      setErrors({ general: "Google registration failed. Please try again." });
    },
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  useEffect(() => {
    if (!authToken) return;
    const validateToken = async () => {
      dispatch(setIsLoading(true));
      try {
        const userResponse = await getUser();
        const { user } = userResponse;
        dispatch(
          setAuth({
            _id: user._id,
            authToken: authToken,
            email: user.email,
            name: user.name,
            organizations: user.organizations,
            accountCreatedAt: new Date(user.createdAt).toISOString(),
          })
        );

        if (user.organizations.length === 0) {
          router.push("/create-organization");
        } else {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error(error);
      } finally {
        dispatch(setIsLoading(false));
      }
    };
    void validateToken();
  }, [authToken]);

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
            x: [0, -120, 0],
            y: [0, 80, 0],
          }}
          transition={{
            duration: 22,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute top-1/3 right-1/4 w-72 h-72 bg-accent/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -120, 0],
          }}
          transition={{
            duration: 18,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl"
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
              initial={{ scale: 0.8, rotate: 10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
              className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 shadow-lg"
            >
              <img src="logo.png" alt="" />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{
                  duration: 10,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                className="absolute -top-1 -left-1"
              >
                <Sparkles className="w-5 h-5 text-primary" />
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
              Create your account to get started.
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
                  <CardTitle className="text-2xl font-semibold text-center bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                    Create Account
                  </CardTitle>
                  <CardDescription className="text-center text-muted-foreground">
                    Fill in your information to create your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
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
                            You're creating an account with an organization
                            invitation. Please use the email address:{" "}
                            <strong>{inviteState.email}</strong>
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setInviteDismissed(true);
                              dispatch(clearInviteData());
                              setFormData((prev) => ({ ...prev, email: "" }));
                            }}
                            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline text-left w-fit transition-colors"
                          >
                            Not you? Register without invitation
                          </button>
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                  )}

                  <form onSubmit={handleRegister} className="space-y-5">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="name" className="text-sm font-medium">
                        Full Name
                      </Label>
                      <div className="relative group">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          className="pl-10 h-11 border-border/50 focus:border-accent/50 transition-all duration-200"
                          required
                        />
                      </div>
                      {errors.name && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-destructive flex items-center gap-1"
                        >
                          <AlertCircle className="h-3 w-3" />
                          {errors.name}
                        </motion.div>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
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
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          disabled={isInviteFlow}
                          className="pl-10 h-11 border-border/50 focus:border-accent/50 transition-all duration-200 disabled:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-100"
                          required
                        />
                      </div>
                      {errors.email && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-destructive flex items-center gap-1"
                        >
                          <AlertCircle className="h-3 w-3" />
                          {errors.email}
                        </motion.div>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="password" className="text-sm font-medium">
                        Password
                      </Label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          value={formData.password}
                          onChange={(e) =>
                            handleInputChange("password", e.target.value)
                          }
                          className="pl-10 pr-10 h-11 border-border/50 focus:border-accent/50 transition-all duration-200"
                          required
                        />
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-muted-foreground hover:text-accent transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </motion.button>
                      </div>
                      {errors.password && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-destructive flex items-center gap-1"
                        >
                          <AlertCircle className="h-3 w-3" />
                          {errors.password}
                        </motion.div>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="space-y-2"
                    >
                      <Label
                        htmlFor="confirmPassword"
                        className="text-sm font-medium"
                      >
                        Confirm Password
                      </Label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            handleInputChange("confirmPassword", e.target.value)
                          }
                          className="pl-10 pr-10 h-11 border-border/50 focus:border-accent/50 transition-all duration-200"
                          required
                        />
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-3 text-muted-foreground hover:text-accent transition-colors"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </motion.button>
                      </div>
                      {errors.confirmPassword && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-destructive flex items-center gap-1"
                        >
                          <AlertCircle className="h-3 w-3" />
                          {errors.confirmPassword}
                        </motion.div>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="flex items-start space-x-3 pt-2"
                    >
                      <Checkbox
                        id="terms"
                        checked={formData.agreeToTerms}
                        onCheckedChange={(checked) =>
                          handleInputChange("agreeToTerms", checked as boolean)
                        }
                        className="mt-0.5 border border-[#60605F]"
                      />
                      <Label
                        htmlFor="terms"
                        className="text-sm leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I agree to the{" "}
                        <Link
                          href="/terms"
                          className="text-accent hover:text-accent/80 underline font-medium"
                        >
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/privacy"
                          className="text-accent hover:text-accent/80 underline font-medium"
                        >
                          Privacy Policy
                        </Link>
                      </Label>
                    </motion.div>
                    {errors.terms && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-destructive flex items-center gap-1"
                      >
                        <AlertCircle className="h-3 w-3" />
                        {errors.terms}
                      </motion.div>
                    )}

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <button
                        type="submit"
                        disabled={isLoading || rtkLoading || !validForm}
                        className="w-full h-11 rounded-md font-medium shadow-lg border-0 transition-all duration-200 hover:opacity-90 disabled:opacity-50 text-white"
                        style={{
                          background:
                            "linear-gradient(135deg, #dc2626 0%, #ea580c 100%) !important",
                          color: "white !important",
                          backgroundImage:
                            "linear-gradient(135deg, #dc2626 0%, #ea580c 100%)",
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
                          "Create Account"
                        )}
                      </button>
                    </motion.div>
                  </form>

                  {errors.general && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-md bg-destructive/10 border border-destructive/20"
                    >
                      <div className="flex items-center gap-2 text-sm text-destructive">
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        <span>{errors.general}</span>
                      </div>
                    </motion.div>
                  )}

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
                      onClick={() => handleGoogleRegister()}
                      disabled={isLoading || rtkLoading}
                      className="w-full h-11 bg-transparent border-border/50 hover:bg-accent/5 hover:border-accent/30 transition-all duration-200"
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
                      Already have an account?{" "}
                    </span>
                    <Link
                      href="/"
                      className="text-accent hover:text-accent/80 font-semibold transition-colors"
                    >
                      Sign in
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
