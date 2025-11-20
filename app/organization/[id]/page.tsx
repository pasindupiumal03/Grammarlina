"use client";

import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { authSelector } from "@/lib/slices/auth-slice";
import { getAdminInvitedUsers, inviteUsers, resendInvite, cancelInvite } from "@/api/organization";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import {
  Shield,
  ArrowLeft,
  Pencil,
  Trash2,
  Users,
  KeyRound,
  Copy,
  CheckCircle2,
  Plus,
  Mail,
  Save,
  Image as ImageIcon,
  Sparkles,
  MoreHorizontal,
  Crown,
  Edit,
  UserMinus,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  organizationSelector,
  setOrganizationMembers,
  addOrganizationMember,
  setPendingMembers,
} from "@/lib/slices/organization-slice";
import { useDispatch } from "react-redux";

export default function OrganizationDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { organizations } = useSelector(authSelector);
  const { toast } = useToast();
  const dispatch = useDispatch();
  const [inviteEmail, setInviteEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [domain, setDomain] = useState<string>("");
  const [restrictToDomain, setRestrictToDomain] = useState<boolean>(false);
  const [userLimit, setUserLimit] = useState<number | "">("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [openMenuForUser, setOpenMenuForUser] = useState<string | null>(null);
  const [isInviting, setIsInviting] = useState<boolean>(false);
  const [isProcessingAction, setIsProcessingAction] = useState<boolean>(false);
  const organisationState = useSelector(organizationSelector);
  const menuRef = useRef<HTMLDivElement>(null);

  const getInvitedUsers = useCallback(
    async (orgId: string) => {
      try {
        const response = await getAdminInvitedUsers(orgId);
        dispatch(setOrganizationMembers(response.invitations));
      } catch (error) {
        console.log(error);
      }
    },
    [dispatch]
  );

  const handleResendInvite = async (inviteId: string, email: string) => {
    setIsProcessingAction(true);
    try {
      await resendInvite({
        emails: [{ email }],
        organizationId: organisationState._id,
      });
      toast({
        title: "Invitation Resent",
        description: `Invitation has been resent to ${email}`,
      });
      setOpenMenuForUser(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend invite",
        variant: "destructive",
      });
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleCancelInvite = async (inviteId: string, email: string) => {
    setIsProcessingAction(true);
    try {
      await cancelInvite({
        inviteId,
        organizationId: organisationState._id,
      });
      
      const updatedPendingMembers = (
        organisationState.pendingMembers || []
      ).filter((p) => p._id !== inviteId);
      
      dispatch(setPendingMembers(updatedPendingMembers));
      
      toast({
        title: "Invite Cancelled",
        description: `Invite for ${email} has been cancelled`,
      });
      setOpenMenuForUser(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel invite",
        variant: "destructive",
      });
    } finally {
      setIsProcessingAction(false);
    }
  };

  useEffect(() => {
    console.log(organisationState._id);
    if (!organisationState?._id) return;
    getInvitedUsers(organisationState._id);
  }, [organisationState._id, getInvitedUsers]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuForUser(null);
      }
    };

    if (openMenuForUser) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuForUser]);

  const selected = useMemo(
    () => organizations.find((o) => o._id === params.id),
    [organizations, params.id]
  );
  // Temporarily disable "not found" by falling back to the first organization or a placeholder
  const organization =
    selected ||
    organizations[0] ||
    ({
      _id: String(params.id),
      name: "Grammarlina Team",
      organizationAdmin: "admin@grammarlina.com",
      members: [],
      cookies: [],
      logo: "/logo.svg",
    } as any);

  useMemo(() => {
    setName(organization.name || "");
  }, [organization._id]);

  const handleRename = () => {
    toast({
      title: "Rename",
      description: `Rename ${organization.name} (placeholder)`,
    });
  };
  const handleDelete = () => {
    toast({
      title: "Delete",
      description: `Delete ${organization.name} (placeholder)`,
      variant: "destructive",
    });
  };

  const handleInviteUser = async () => {
    if (!inviteEmail.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    setIsInviting(true);
    try {
      const payload = {
        organizationId: organization._id,
        emails: [inviteEmail.trim()],
      };

      await inviteUsers(payload);

      // Add to pending members list in Redux
      dispatch(
        addOrganizationMember({ 
          email: inviteEmail.trim(), 
          status: "Pending",
          _id: Date.now().toString()
        })
      );

      toast({
        title: "Invitation Sent",
        description: `Invitation sent to ${inviteEmail.trim()}`,
      });

      setInviteEmail("");
    } catch (error) {
      console.error("Failed to send invitation:", error);
      toast({
        title: "Error",
        description: "Failed to send invitation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsInviting(false);
    }
  };

  // animations
  const sectionVariants = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
  };

  const listItemVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      {/* animated background similar to login page */}
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
      <header className="border-b bg-card/95 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0.9, rotate: -5 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
                className="relative w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center"
              >
                <Shield className="w-7 h-7 text-primary" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 8,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                  className="absolute -top-1 -right-1"
                >
                  <Sparkles className="w-4 h-4 text-accent" />
                </motion.div>
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-card-foreground">
                  {organization.name}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Organization settings and membership
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Button>
          </motion.div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8 relative z-10">
        {/* Branding */}
        <motion.div
          variants={sectionVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
        >
          <Card className="card-hover shadow-xl">
            <CardHeader className="flex flex-col gap-1">
              <CardTitle>Branding</CardTitle>
              <CardDescription>
                Upload a logo and set the organization name.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Logo Upload Section */}
              <div className="lg:col-span-1">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-4">
                      Organization Logo
                    </h3>

                    {/* Current Logo Preview */}
                    <div className="relative mb-4 w-full justify-center flex">
                      <div className="w-28 h-28 rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/20 flex items-center justify-center overflow-hidden group hover:border-primary/50 transition-colors">
                        {logoPreview ? (
                          <Image
                            src={logoPreview}
                            alt="Logo preview"
                            width={112}
                            height={112}
                            className="w-full h-full object-cover rounded-xl"
                          />
                        ) : (organization as any).logo ? (
                          <Image
                            src={(organization as any).logo}
                            alt="Current logo"
                            width={112}
                            height={112}
                            className="w-full h-full object-cover rounded-xl"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <ImageIcon className="w-10 h-10 mb-2" />
                            <span className="text-sm font-medium">No logo</span>
                          </div>
                        )}
                      </div>

                      {/* Upload Overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                        <Pencil className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    {/* File Input */}
                    <div className="space-y-3">
                      <label className="flex flex-col items-center w-full h-12 px-4 py-3 text-sm text-foreground bg-background border border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
                        <span className="flex items-center gap-2">
                          <ImageIcon className="w-4 h-4" />
                          Choose Logo
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const url = URL.createObjectURL(file);
                            setLogoPreview(url);
                          }}
                        />
                      </label>
                      <p className="text-xs text-muted-foreground text-center">
                        PNG, JPG, SVG up to 2MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Organization Details */}
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-4">
                      Organization Details
                    </h3>
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Organization Name
                        </label>
                        <Input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Organization name"
                          className="h-11"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-medium text-foreground">
                          Company Domain
                        </label>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <Input
                              value={domain}
                              onChange={(e) => setDomain(e.target.value)}
                              placeholder="company.com"
                              className="font-mono text-sm flex-1 h-11"
                            />
                            <div className="flex items-center gap-2 shrink-0 bg-muted/30 px-3 py-2 rounded-lg">
                              <Switch
                                checked={restrictToDomain}
                                onCheckedChange={setRestrictToDomain}
                                id="domain-restriction"
                              />
                              <label
                                htmlFor="domain-restriction"
                                className="text-xs font-medium text-foreground whitespace-nowrap"
                              >
                                Restrict to domain
                              </label>
                            </div>
                          </div>
                          <div className="bg-muted/20 rounded-lg p-3">
                            <p className="text-xs text-muted-foreground">
                              {restrictToDomain
                                ? `✓ Only users with @${
                                    domain || "company.com"
                                  } emails can join this organization`
                                : "Enter your company's main domain (e.g., grammarlina.com)"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="pt-4 border-t border-border/50">
                    <Button
                      size="sm"
                      onClick={() =>
                        toast({
                          title: "Saved",
                          description: "Branding settings saved (placeholder)",
                        })
                      }
                      className="h-10 px-6"
                    >
                      <Save className="w-4 h-4 mr-2" /> Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Members */}
        <motion.div
          variants={sectionVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, delay: 0.05 }}
        >
          <Card className="card-hover shadow-xl">
            <CardHeader className="flex flex-col gap-1">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-4 h-4" /> Members
              </CardTitle>
              <CardDescription>Invite and manage members.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Input
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Invite by email..."
                  className="border border-muted-foreground/40"
                />
                <Button
                  size="sm"
                  onClick={handleInviteUser}
                  disabled={isInviting || !inviteEmail.trim()}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  {isInviting ? "Inviting..." : "Invite"}
                </Button>
              </div>
              {organization.members?.length ||
              organisationState.pendingMembers?.length ? (
                <ul className="divide-y rounded-md border overflow-visible">
                  {/* Existing Members */}
                  {organization.members?.map((m, idx) => (
                    <motion.li
                      key={m}
                      variants={listItemVariants}
                      initial="initial"
                      whileInView="animate"
                      viewport={{ once: true }}
                      transition={{ duration: 0.25, delay: idx * 0.05 }}
                      className="flex items-center justify-between px-3 py-2 bg-card"
                    >
                      <span className="text-sm text-foreground">{m}</span>
                      <div className="relative" ref={menuRef}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() =>
                            setOpenMenuForUser(openMenuForUser === m ? null : m)
                          }
                        >
                          <MoreHorizontal className="w-4 h-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>

                        {openMenuForUser === m && (
                          <div className="absolute right-0 top-8 w-48 bg-white border rounded-md shadow-lg z-50">
                            <div className="py-1">
                              <button
                                onClick={() => {
                                  toast({
                                    title: "Role Updated",
                                    description: `${m} is now Admin (placeholder)`,
                                  });
                                  setOpenMenuForUser(null);
                                }}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-gray-100 cursor-pointer"
                              >
                                <Crown className="w-4 h-4" />
                                Make Admin
                              </button>
                              <button
                                onClick={() => {
                                  toast({
                                    title: "Role Updated",
                                    description: `${m} is now Editor (placeholder)`,
                                  });
                                  setOpenMenuForUser(null);
                                }}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-gray-100 cursor-pointer"
                              >
                                <Edit className="w-4 h-4" />
                                Make Editor
                              </button>
                              <hr className="my-1" />
                              <button
                                onClick={() => {
                                  toast({
                                    title: "Removed",
                                    description: `${m} removed (placeholder)`,
                                  });
                                  setOpenMenuForUser(null);
                                }}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left text-red-600 hover:bg-red-50 cursor-pointer"
                              >
                                <UserMinus className="w-4 h-4" />
                                Remove User
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.li>
                  ))}

                  {/* Pending Members */}
                  {organisationState.pendingMembers?.map((member, idx) => (
                    <motion.li
                      key={`pending-${member.email}`}
                      variants={listItemVariants}
                      initial="initial"
                      whileInView="animate"
                      viewport={{ once: true }}
                      transition={{ duration: 0.25, delay: idx * 0.05 }}
                      className="flex items-center justify-between px-3 py-2 bg-card"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-foreground">
                          {member.email}
                        </span>
                        {member.status === "pending" && <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                          {member.status}
                        </span>}
                      </div>
                      <div className="relative" ref={menuRef}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() =>
                            setOpenMenuForUser(
                              openMenuForUser === member.email
                                ? null
                                : member.email
                            )
                          }
                        >
                          <MoreHorizontal className="w-4 h-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>

                        {openMenuForUser === member.email && (
                          <div 
                            ref={menuRef}
                            className="absolute right-0 top-8 w-48 bg-white border rounded-md shadow-lg z-50"
                          >
                            <div className="py-1">
                              <button
                                onClick={async (e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  console.log("resend invite clicked", member._id, member.email);
                                  await handleResendInvite(member._id, member.email);
                                }}
                                disabled={isProcessingAction}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-gray-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Mail className="w-4 h-4" />
                                {isProcessingAction ? "Sending..." : "Resend Invitation"}
                              </button>
                              <hr className="my-1" />
                              <button
                                onClick={async (e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  await handleCancelInvite(member._id, member.email);
                                }}
                                disabled={isProcessingAction}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left text-red-600 hover:bg-red-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <UserMinus className="w-4 h-4" />
                                {isProcessingAction ? "Cancelling..." : "Cancel Invitation"}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground font-medium">
                    No members yet
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Invite team members to get started
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          variants={sectionVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          <Card className="border-red-200 shadow-xl">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible actions for this organization.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Delete this organization and all its data.
              </p>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="w-4 h-4 mr-2" /> Delete Organization
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <Toaster />
    </div>
  );
}
