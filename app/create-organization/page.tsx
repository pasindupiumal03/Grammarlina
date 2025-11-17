"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Building2,
  Users,
  Mail,
  Plus,
  X,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Sparkles,
  Globe,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { addOrganization } from "@/lib/slices/auth-slice";
import { useRouter } from "next/navigation";
import { createOrganization, inviteUsers } from "@/api/organization";
import {
  organizationSelector,
  setIsLoading,
  setOrganization,
} from "@/lib/slices/organization-slice";
import { useSelector } from "react-redux";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

const organizationTypes = [
  {
    value: "startup",
    label: "Startup",
    description: "Small team, fast-moving",
  },
  {
    value: "enterprise",
    label: "Enterprise",
    description: "Large organization",
  },
  { value: "agency", label: "Agency", description: "Client services" },
  { value: "nonprofit", label: "Non-profit", description: "Social impact" },
  {
    value: "education",
    label: "Education",
    description: "Schools & universities",
  },
  {
    value: "freelance",
    label: "Freelance",
    description: "Individual contractor",
  },
];

export default function CreateOrganizationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [orgName, setOrgName] = useState("");
  const [orgType, setOrgType] = useState("");
  const [orgDomain, setOrgDomain] = useState("");
  const [inviteEmails, setInviteEmails] = useState<any[]>([]);
  const [currentEmail, setCurrentEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isLoading = useAppSelector(organizationSelector).isLoading;
  const organizationId = useSelector(organizationSelector)._id;

  const dispatch = useAppDispatch();
  const rtkLoading = useAppSelector((s) => s.auth.isLoading);
  const router = useRouter();

  const { toast } = useToast();

  const addEmail = () => {

    // TODO double check

    if (currentEmail && /\S+@\S+\.\S+/.test(currentEmail)) {
      if (!inviteEmails.some((email) => email.email === currentEmail)) {
        setInviteEmails([
          ...inviteEmails,
          {
            email: currentEmail,
          },
        ]);
        setCurrentEmail("");
        setErrors((prev) => ({ ...prev, email: "" }));
      } else {
        setErrors((prev) => ({ ...prev, email: "Email already added" }));
      }
    } else {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address",
      }));
    }
  };

  const removeEmail = (emailToRemove: string) => {
    setInviteEmails(inviteEmails.filter((item) => item.email !== emailToRemove));
  };

  const handleNext = async () => {
    try {
      if (currentStep === 1) {
        if (!orgName.trim()) {
          setErrors({ orgName: "Organization name is required" });
          return;
        }
        if (!orgType) {
          setErrors({ orgType: "Please select an organization type" });
          return;
        }
        if(!orgDomain.trim()) {
          setErrors({ orgDomain: "Organization domain is required" });
          return;
        }

        setErrors({});

        dispatch(setIsLoading(true));

        const createdOrg = await createOrganization({
          name: orgName,
          type: orgType,
          domain: orgDomain.trim() || undefined,
        });

        const { organization } = createdOrg;

        dispatch(setOrganization(organization));
        dispatch(setIsLoading(false));

        setCurrentStep(2);
      }
    } catch (error) {
      console.log(error)
      dispatch(setIsLoading(false));
      
      toast({
        title: "Error",
        description: (error as any).message || "Failed to create organization. Please try again.",
        variant: "destructive",
      });

      setErrors({
        general: "Failed to create organization. Please try again.",
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = async () => {
    try {
      dispatch(setIsLoading(false));

      const inviteResponse = await inviteUsers({
        emails: inviteEmails,
        organizationId: organizationId,
      });
      if (inviteResponse.success) {
        router.push("/dashboard");
      } else {
        setErrors({
          general: "Failed to invite users. Please try again.",
        });
      }
    } catch (err) {
      dispatch(setIsLoading(false));
      setErrors({
        general: "Failed to invite users. Please try again.",
      });
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const handleSkip = async () => {
    try {
      router.push("/dashboard");
    } catch (err) {
      setErrors({
        general: "Failed to create organization. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, -100, 0] }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -150, 0], y: [0, 100, 0] }}
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
              style={{
                background: "linear-gradient(135deg, #1e40af 0%, #3730a3 100%)",
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
              className="text-3xl font-bold text-foreground bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text"
            >
              Create Your Organization
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-muted-foreground mt-2 text-balance"
            >
              Set up your workspace and invite your team
            </motion.p>
          </div>

          <div className="md:w-1/2 w-full flex justify-center md:justify-end">
            <div className="w-full max-w-md">
              {/* Progress Indicator */}
              <div className="flex items-center justify-center mb-6">
                <div className="flex items-center space-x-4">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      currentStep >= 1
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {currentStep > 1 ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      "1"
                    )}
                  </div>
                  <div
                    className={`w-12 h-0.5 ${
                      currentStep >= 2 ? "bg-primary" : "bg-muted"
                    }`}
                  />
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      currentStep >= 2
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    2
                  </div>
                </div>
              </div>
              <Card className="border-border/50 shadow-xl backdrop-blur-sm bg-card/95 card-hover">
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CardHeader className="space-y-1 pb-4">
                        <CardTitle className="text-2xl font-semibold flex items-center gap-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                          <Building2 className="w-5 h-5" />
                          Organization Details
                        </CardTitle>
                        <CardDescription>
                          Tell us about your organization to get started
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="orgName">Organization Name</Label>
                          <Input
                            id="orgName"
                            placeholder="Enter your organization name"
                            value={orgName}
                            onChange={(e) => {
                              setOrgName(e.target.value);
                              if (errors.orgName)
                                setErrors((prev) => ({ ...prev, orgName: "" }));
                            }}
                            className={
                              errors.orgName
                                ? "h-11 border-destructive"
                                : "h-11 border-border/50 focus:border-primary/50"
                            }
                          />
                          {errors.orgName && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-sm text-destructive flex items-center gap-1"
                            >
                              <AlertCircle className="h-3 w-3" />
                              {errors.orgName}
                            </motion.div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="orgType">Organization Type</Label>
                          <Select
                            value={orgType}
                            onValueChange={(value) => {
                              setOrgType(value);
                              if (errors.orgType)
                                setErrors((prev) => ({ ...prev, orgType: "" }));
                            }}
                          >
                            <SelectTrigger
                              className={
                                errors.orgType
                                  ? "h-11 border-destructive"
                                  : "h-11 border-border/50 focus:border-primary/50"
                              }
                            >
                              <SelectValue placeholder="Select organization type" />
                            </SelectTrigger>
                            <SelectContent>
                              {organizationTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  <div className="flex flex-col">
                                    <span className="font-medium">
                                      {type.label}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {type.description}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.orgType && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-sm text-destructive flex items-center gap-1"
                            >
                              <AlertCircle className="h-3 w-3" />
                              {errors.orgType}
                            </motion.div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="orgDomain" className="text-sm font-medium">
                            Organization Domain
                          </Label>
                          <div className="relative group">
                            <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                              id="orgDomain"
                              type="url"
                              placeholder="example.com"
                              value={orgDomain}
                              onChange={(e) => {
                                setOrgDomain(e.target.value);
                                if (errors.orgDomain)
                                  setErrors((prev) => ({ ...prev, orgDomain: "" }));
                              }}
                              required
                              className="pl-10 h-11 border-border/50 focus:border-primary/50 transition-all duration-200"
                            />
                          </div>
                          {errors.orgDomain && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-sm text-destructive flex items-center gap-1"
                            >
                              <AlertCircle className="h-3 w-3" />
                              {errors.orgDomain}
                            </motion.div>
                          )}
                        </div>

                        <div className="flex justify-end">
                          <Button
                            onClick={handleNext}
                            className="flex items-center gap-2 h-11 rounded-md font-medium shadow-lg border-0 transition-all duration-200 hover:opacity-90"
                            style={{
                              background:
                                "linear-gradient(135deg, #1e40af 0%, #3730a3 100%)",
                              color: "white",
                              backgroundImage:
                                "linear-gradient(135deg, #1e40af 0%, #3730a3 100%)",
                            }}
                          >
                            Create Organization
                          </Button>
                        </div>
                      </CardContent>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CardHeader className="space-y-1 pb-4">
                        <CardTitle className="text-2xl font-semibold flex items-center gap-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                          <Users className="w-5 h-5" />
                          Invite Team Members
                        </CardTitle>
                        <CardDescription>
                          Add your team members to collaborate (optional)
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Addresses</Label>
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="email"
                                type="email"
                                placeholder="Enter email address"
                                value={currentEmail}
                                onChange={(e) => {
                                  setCurrentEmail(e.target.value);
                                  if (errors.email)
                                    setErrors((prev) => ({
                                      ...prev,
                                      email: "",
                                    }));
                                }}
                                onKeyPress={(e) =>
                                  e.key === "Enter" && addEmail()
                                }
                                className={
                                  errors.email
                                    ? "pl-10 h-11 border-destructive"
                                    : "pl-10 h-11 border-border/50 focus:border-primary/50"
                                }
                              />
                            </div>
                            <Button
                              onClick={addEmail}
                              size="icon"
                              variant="outline"
                              className="bg-transparent hover:bg-accent/5 hover:text-black hover:border-accent/30 h-11 w-11"
                            >
                              <Plus className="w-11 h-11" />
                            </Button>
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
                        </div>

                        {inviteEmails.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="space-y-2"
                          >
                            <Label>
                              Invited Members ({inviteEmails.length})
                            </Label>
                            <div className="flex flex-wrap gap-2">
                              {inviteEmails.map((item, index) => (
                                <motion.div
                                  key={item.email}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: index * 0.1 }}
                                >
                                  <Badge
                                    variant="secondary"
                                    className="flex items-center gap-1"
                                  >
                                    {item.email}
                                    <button
                                      onClick={() => removeEmail(item.email)}
                                      className="ml-1 hover:text-destructive"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </Badge>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        <Alert className="border-border/20 bg-background/60">
                          <Sparkles className="h-4 w-4" />
                          <AlertDescription>
                            Don't worry! You can always invite more team members
                            later from your dashboard.
                          </AlertDescription>
                        </Alert>

                        <div className="flex justify-between w-full">
                          <div className="flex gap-2 justify-between w-full">
                            <Button
                              variant="outline"
                              onClick={handleSkip}
                              // disabled={isLoading || rtkLoading}
                              className="bg-transparent hover:bg-accent/5 hover:border-accent/30 hover:text-black h-11"
                            >
                              Skip for now
                            </Button>
                            <Button
                              onClick={handleFinish}
                              disabled={isLoading}
                              className="flex items-center gap-2 h-11 rounded-md font-medium shadow-lg border-0 transition-all duration-200 hover:opacity-90"
                              style={{
                                background:
                                  "linear-gradient(135deg, #1e40af 0%, #3730a3 100%)",
                                color: "white",
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
                                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                />
                              ) : (
                                <>
                                  <Plus className="w-4 h-4" />
                                  Invite Users
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>

              {/* Organization Summary */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6"
                >
                  <Card className="bg-muted/50">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-3">
                        Organization Summary
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Name:</span>
                          <span className="font-medium">{orgName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type:</span>
                          <span className="font-medium">
                            {
                              organizationTypes.find((t) => t.value === orgType)
                                ?.label
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Team Members:
                          </span>
                          <span className="font-medium">
                            {inviteEmails.length + 1} (including you)
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
      <Toaster />
    </div>
  );
}
