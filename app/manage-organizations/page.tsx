"use client";

import { useState, useEffect, useRef, useCallback, Fragment } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { Menu, Transition } from "@headlessui/react";
import {
  organizationSelector,
  setOrganizationMembers,
  addOrganizationMember,
  setOrganization,
  setPendingMembers,
  setUserCategories,
  addUserCategory,
  updateUserCategory,
  removeUserCategory,
  addPendingMember,
} from "@/lib/slices/organization-slice";
import {
  getAdminInvitedUsers,
  inviteUsers,
  promoteToModerator,
  promoteToEditor,
  demoteFromModerator,
  demoteFromEditor,
  removeMember,
  updateOrganization,
  cancelInvite,
  resendInvite,
  updateCategories,
  updateUserCategories,
  deleteOrganization,
} from "@/api/organization";
import { Button } from "@/components/ui/button";
import AppHeader from "@/components/AppHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import ConfirmDialog from "@/components/ConfirmDialog";
import {
  Save,
  Building2,
  ImageIcon,
  Pencil,
  Users,
  Mail,
  MoreHorizontal,
  Crown,
  Edit,
  UserMinus,
  Trash2,
  Plus,
  Check,
  X,
  Shield,
  UserCheck,
  UserX,
} from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import AdminGuard from "@/components/AdminGuard";
import { authSelector } from "@/lib/slices/auth-slice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ManageOrganizationsPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const organization = useSelector(organizationSelector);
  const authState = useSelector(authSelector);

  const [name, setName] = useState<string>("");
  const [domain, setDomain] = useState<string>("");
  const [restrictToDomain, setRestrictToDomain] = useState<boolean>(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoBase64, setLogoBase64] = useState<string>("");
  const [inviteEmail, setInviteEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [isInviting, setIsInviting] = useState<boolean>(false);
  const [isLoadingMembers, setIsLoadingMembers] = useState<boolean>(false);
  const [isProcessingAction, setIsProcessingAction] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState<boolean>(false);
  const [removeTarget, setRemoveTarget] = useState<{
    userId: string;
    email: string;
  } | null>(null);
  const [showCancelInviteDialog, setShowCancelInviteDialog] =
    useState<boolean>(false);
  const [cancelInviteTarget, setCancelInviteTarget] = useState<{
    inviteId: string;
    email: string;
  } | null>(null);
  const [showDeleteOrgDialog, setShowDeleteOrgDialog] =
    useState<boolean>(false);
  const [isDeletingOrg, setIsDeletingOrg] = useState<boolean>(false);

  // Edit User States
  const [showEditUserDialog, setShowEditUserDialog] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<{
    _id: string;
    email: string;
    categories: string[];
  } | null>(null);
  const [selectedUserCategory, setSelectedUserCategory] =
    useState<string>("none");
  const [isUpdatingUserCategories, setIsUpdatingUserCategories] =
    useState<boolean>(false);
  const isAdmin = organization.organizationAdmin._id === authState._id;
  const isModerator = organization.moderators.some(
    (moderator) => moderator._id === authState._id
  );
  const isEditor = organization.editors.some(
    (editor) => editor._id === authState._id
  );
  const modCanRemove = ["editor", "member"];

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setInviteEmail(email);

    if (email.trim() === "") {
      setEmailError("");
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  // Load organization data
  useEffect(() => {
    if (organization._id) {
      setName(organization.name || "");
      setDomain(organization.domain || "");
      setRestrictToDomain(organization.restrictToDomain || false);
      setLogoBase64(organization.logo || "");
    }
  }, [
    organization._id,
    organization.name,
    organization.domain,
    organization.restrictToDomain,
    organization.logo,
  ]);

  // Convert file to base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Fetch invited users
  const getInvitedUsers = useCallback(
    async (orgId: string) => {
      try {
        setIsLoadingMembers(true);
        const response = await getAdminInvitedUsers(orgId);
        dispatch(setPendingMembers(response.invitations));
        dispatch(setOrganizationMembers(response.members));
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoadingMembers(false);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (!organization._id) return;
    getInvitedUsers(organization._id);
  }, [organization._id, getInvitedUsers]);

  // If no organization selected, redirect to dashboard
  if (!organization._id) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">
                No Organization Selected
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Please select an organization from the dashboard
              </p>
              <Button onClick={() => router.push("/dashboard")}>
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSaveChanges = async () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Organization name is required",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const payload: any = {
        organizationId: organization._id,
        name: name.trim(),
        type: organization.type || "company", // Use existing type or default to company
        isDomainOpen: restrictToDomain,
        logo: logoBase64,
      };

      // Only include domain if it has changed
      if (domain.trim() !== (organization.domain || "").trim()) {
        payload.domain = domain.trim();
      }

      await updateOrganization(payload);

      // Update the organization in Redux store
      dispatch(
        setOrganization({
          ...organization,
          name: name.trim(),
          domain: domain.trim(),
          restrictToDomain: restrictToDomain,
          logo: logoBase64,
        })
      );

      // Clear the logo preview and file since it's now saved
      setLogoPreview(null);
      setLogoFile(null);

      toast({
        title: "Success",
        description: "Organization settings saved successfully",
      });
    } catch (error) {
      console.error("Failed to update organization:", error);
      toast({
        title: "Error",
        description: "Failed to save organization settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const [inviteRole, setInviteRole] = useState<string>("member");
  const [inviteCategory, setInviteCategory] = useState<string>("");

  // Ensure moderators can't select moderator role
  useEffect(() => {
    if (isModerator && !isAdmin && inviteRole === "moderator") {
      setInviteRole("member");
    }
  }, [isModerator, isAdmin, inviteRole]);
  const [isManageCategoriesOpen, setIsManageCategoriesOpen] = useState(false);
  const [editedCategories, setEditedCategories] = useState<
    Array<{
      categoryName: string;
      users: Array<{ _id: string; email: string }>;
      _id: string;
    }>
  >(organization.usercategories || []);
  const [newEditedCategory, setNewEditedCategory] = useState("");
  const [renamingIndex, setRenamingIndex] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState<string>("");
  const [categoryRenames, setCategoryRenames] = useState<
    Array<{ _id: string; name: string }>
  >([]);
  const [categoryDeletions, setCategoryDeletions] = useState<string[]>([]);
  const [categoryAdds, setCategoryAdds] = useState<string[]>([]);

  const openManageCategories = () => {
    setEditedCategories([...(organization.usercategories || [])]);
    setCategoryRenames([]);
    setCategoryDeletions([]);
    setCategoryAdds([]);
    setIsManageCategoriesOpen(true);
  };

  const handleAddEditedCategory = () => {
    const name = newEditedCategory.trim();
    if (!name) return;
    const exists = editedCategories.some(
      (c) => c.categoryName.toLowerCase() === name.toLowerCase()
    );
    if (exists) {
      toast({
        title: "Category exists",
        description: `"${name}" already exists.`,
      });
      return;
    }
    const newCategory = {
      categoryName: name,
      users: [],
      _id: `temp_${Date.now()}`, // Temporary ID for new categories
    };

    // Add to category adds array
    setCategoryAdds((prev) => [...prev, name]);

    // Add to local state only (not Redux until save)
    setEditedCategories([...editedCategories, newCategory]);

    setNewEditedCategory("");
  };

  const startRenameCategory = (index: number) => {
    setRenamingIndex(index);
    setRenameValue(editedCategories[index].categoryName);
  };

  const saveRenameCategory = () => {
    if (renamingIndex === null) return;
    const name = renameValue.trim();
    const current = editedCategories[renamingIndex];
    if (!name || name === current.categoryName) {
      setRenamingIndex(null);
      return;
    }
    const exists = editedCategories.some(
      (c, i) =>
        i !== renamingIndex &&
        c.categoryName.toLowerCase() === name.toLowerCase()
    );
    if (exists) {
      toast({
        title: "Category exists",
        description: `"${name}" already exists.`,
      });
      return;
    }
    const updatedCategory = { ...current, categoryName: name };

    // Add to category renames array
    setCategoryRenames((prev) => {
      const existingIndex = prev.findIndex((item) => item._id === current._id);
      if (existingIndex !== -1) {
        // Update existing rename
        const updated = [...prev];
        updated[existingIndex] = { _id: current._id, name: name };
        return updated;
      } else {
        // Add new rename
        return [...prev, { _id: current._id, name: name }];
      }
    });

    // Update local state only (not Redux until save)
    const copy = [...editedCategories];
    copy[renamingIndex] = updatedCategory;
    setEditedCategories(copy);

    if (inviteCategory === current.categoryName) {
      setInviteCategory(name);
    }
    setRenamingIndex(null);
  };

  const cancelRenameCategory = () => {
    setRenamingIndex(null);
    setRenameValue("");
  };

  const handleRemoveEditedCategory = (index: number) => {
    const copy = [...editedCategories];
    const removed = copy.splice(index, 1)[0];

    // Add to category deletions array
    setCategoryDeletions((prev) => [...prev, removed._id]);

    // Update local state only (not Redux until save)
    setEditedCategories(copy);

    if (inviteCategory === removed.categoryName) {
      setInviteCategory("none");
    }
  };

  const handleSaveEditedCategories = async () => {
    try {
      // Call the API to update categories
      const response = await updateCategories({
        organizationId: organization._id,
        renames: categoryRenames,
        deletions: categoryDeletions,
        adds: categoryAdds,
      });

      if (response.organization.usercategories) {
        dispatch(
          setOrganization({
            ...organization,
            usercategories: response.organization.usercategories,
          })
        );
      }

      // Update the organization object to sync with Redux state

      // Check if the selected invite category still exists
      if (
        inviteCategory &&
        inviteCategory !== "none" &&
        !editedCategories.some((cat) => cat.categoryName === inviteCategory)
      ) {
        setInviteCategory("none");
      }

      setIsManageCategoriesOpen(false);
      toast({ title: "Categories updated" });
    } catch (error) {
      console.error("Failed to save categories:", error);
      toast({
        title: "Error",
        description: "Failed to save categories. Please try again.",
        variant: "destructive",
      });
    }
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

    if (!validateEmail(inviteEmail)) {
      setEmailError("Please enter a valid email address");
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsInviting(true);
    try {
      const payload = {
        organizationId: organization._id,
        emails: [
          {
            email: inviteEmail.trim(),
            userRole: inviteRole,
            category: inviteCategory === "none" ? undefined : inviteCategory,
          },
        ],
      };

      const { data } = await inviteUsers(payload);
      const { successful } = data;

      dispatch(
        addPendingMember({
          email: inviteEmail.trim(),
          status: "pending",
          userRole: inviteRole,
          _id: successful[0]?._id,
        })
      );

      toast({
        title: "Invitation Sent",
        description: `Invitation sent to ${inviteEmail.trim()}`,
      });

      // Reset all invite fields
      setInviteEmail("");
      setEmailError("");
      setInviteRole("member");
      setInviteCategory("");
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

  const handleDeleteOrganization = () => {
    setShowDeleteOrgDialog(true);
  };

  const confirmDeleteOrganization = async () => {
    console.log(
      "confirmDeleteOrganization: starting, setting isDeletingOrg to true"
    );
    setIsDeletingOrg(true);
    try {
      console.log("confirmDeleteOrganization: calling deleteOrganization API");
      await deleteOrganization(organization._id);

      console.log("confirmDeleteOrganization: API success");
      toast({
        title: "Organization Deleted",
        description: `${organization.name} has been deleted successfully`,
      });

      // Redirect to dashboard or home after deletion
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to delete organization:", error);
      toast({
        title: "Error",
        description: "Failed to delete organization. Please try again.",
        variant: "destructive",
      });
      setIsDeletingOrg(false);
    } finally {
      console.log("confirmDeleteOrganization: closing dialog");
      setShowDeleteOrgDialog(false);
    }
  };

  // Edit User Functions
  const handleEditUserClick = (member: any) => {
    setEditingUser({
      _id: member._id,
      email: member.email,
      categories: member.categories || [],
    });
    // Set the first category if user has any, otherwise "none"
    setSelectedUserCategory(
      member.categories && member.categories.length > 0
        ? member.categories[0]
        : "none"
    );
    setShowEditUserDialog(true);
  };

  const handleUpdateUserCategories = async () => {
    if (!editingUser || !organization._id) return;

    setIsUpdatingUserCategories(true);
    try {
      const categories =
        selectedUserCategory && selectedUserCategory !== "none"
          ? [selectedUserCategory]
          : [];

      await updateUserCategories({
        userId: editingUser._id,
        organizationId: organization._id,
        categoryName: categories[0],
      });

      // Update local state
      const updatedMembers = (organization.members || []).map((member) =>
        member._id === editingUser._id
          ? { ...member, categories: categories }
          : member
      );
      dispatch(setOrganizationMembers(updatedMembers));

      toast({
        title: "User Updated",
        description: `Category updated for ${editingUser.email}`,
      });

      setShowEditUserDialog(false);
      setEditingUser(null);
      setSelectedUserCategory("none");
    } catch (error: any) {
      console.error("Error updating user categories:", error);
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to update user categories",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingUserCategories(false);
    }
  };

  const handleCancelEditUser = () => {
    setShowEditUserDialog(false);
    setEditingUser(null);
    setSelectedUserCategory("none");
  };

  const handlePromoteToModeratorClick = async (email: string) => {
    setIsProcessingAction(true);
    try {
      await promoteToModerator({
        email,
        organizationId: organization._id,
      });

      // Update local state
      const updatedMembers = (organization.members || []).map((member) =>
        member.email === email ? { ...member, roles: ["moderator"] } : member
      );
      dispatch(setOrganizationMembers(updatedMembers));

      toast({
        title: "Role Updated",
        description: `${email} is now a Moderator`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to promote user to moderator",
        variant: "destructive",
      });
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handlePromoteToEditorFromInvitedClick = async (email: string) => {
    setIsProcessingAction(true);
    try {
      await promoteToEditor({
        email,
        organizationId: organization._id,
      });

      // Update local state
      const updatedMembers = (organization.members || []).map((member) =>
        member.email === email ? { ...member, roles: ["editor"] } : member
      );
      dispatch(setOrganizationMembers(updatedMembers));

      toast({
        title: "Role Updated",
        description: `${email} is now an Editor`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to promote user to editor",
        variant: "destructive",
      });
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleRemoveInvitedUserClick = async (
    userId: string,
    email: string
  ) => {
    setIsProcessingAction(true);
    try {
      await removeMember({
        userId,
        organizationId: organization._id,
      });

      // Update local state
      const updatedMembers = (organization.members || []).filter(
        (member) => member._id !== userId
      );
      dispatch(setOrganizationMembers(updatedMembers));

      toast({
        title: "User Removed",
        description: `${email} has been removed from the organization`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove user from organization",
        variant: "destructive",
      });
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleDemoteFromModeratorClick = async (email: string) => {
    setIsProcessingAction(true);
    try {
      await demoteFromModerator({
        email,
        organizationId: organization._id,
      });

      // Update local state - remove moderator role
      const updatedMembers = (organization.members || []).map((member) =>
        member.email === email ? { ...member, roles: [] } : member
      );
      dispatch(setOrganizationMembers(updatedMembers));

      toast({
        title: "Role Updated",
        description: `${email} is no longer a Moderator`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to demote user from moderator",
        variant: "destructive",
      });
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleDemoteFromEditorClick = async (email: string) => {
    setIsProcessingAction(true);
    try {
      await demoteFromEditor({
        email,
        organizationId: organization._id,
      });

      // Update local state - remove editor role
      const updatedMembers = (organization.members || []).map((member) =>
        member.email === email ? { ...member, roles: [] } : member
      );
      dispatch(setOrganizationMembers(updatedMembers));

      toast({
        title: "Role Updated",
        description: `${email} is no longer an Editor`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to demote user from editor",
        variant: "destructive",
      });
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleResendInviteClick = async (inviteId: string, email: string) => {
    console.log("handleResendInviteClick called", { inviteId, email });
    setIsProcessingAction(true);
    try {
      const result = await resendInvite({
        emails: [{ email }],
        organizationId: organization._id,
      });
      console.log("Resend invite result:", result);

      toast({
        title: "Invitation Resent",
        description: `Invitation has been resent to ${email}`,
      });
    } catch (error) {
      console.error("Resend invite error:", error);
      toast({
        title: "Error",
        description: "Failed to resend invite",
        variant: "destructive",
      });
    } finally {
      setIsProcessingAction(false);
    }
  };

  const cancelInviteClick = async (inviteId: string, email: string) => {
    setIsProcessingAction(true);
    try {
      await cancelInvite({
        inviteId,
        organizationId: organization._id,
      });

      // Update local state - remove editor role
      const updatedPendingMembers = (organization.pendingMembers || []).filter(
        (member) => member._id !== inviteId
      );
      dispatch(setPendingMembers(updatedPendingMembers));

      toast({
        title: "Invite Cancelled",
        description: `Invite for ${email} has been cancelled`,
      });
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

  const sectionVariants = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
  };

  const listItemVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
  };

  console.log({ organization });

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Animated background */}
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

        {/* Header */}
        <AppHeader
          title="Organization Management"
          subtitle="Organization settings and management"
          variant="organization"
          organizationName={organization.name}
          showBackButton={true}
          onBackClick={() => router.push("/dashboard")}
          isAdmin={isAdmin}
          isModerator={isModerator}
          isEditor={isEditor}
          userInfo={{
            name: authState.name,
            email: authState.email,
          }}
        />

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 space-y-8 relative z-10">
          {/* Branding Section */}
          {isAdmin && (
            <motion.div
              variants={sectionVariants}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45 }}
            >
              <Card className="card-hover shadow-xl">
                <CardHeader>
                  <CardTitle>Organization Details</CardTitle>
                  <CardDescription>
                    Update your organization name and logo
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Logo Upload Section */}
                  <div className="lg:col-span-1">
                    <div className="space-y-4">
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
                          ) : organization.logo ? (
                            <Image
                              src={organization.logo}
                              alt="Current logo"
                              width={112}
                              height={112}
                              className="w-full h-full object-cover rounded-xl"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                              <ImageIcon className="w-10 h-10 mb-2" />
                              <span className="text-sm font-medium">
                                No logo
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Upload Overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center pointer-events-none">
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
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;

                              // Validate file size (2MB limit)
                              if (file.size > 2 * 1024 * 1024) {
                                toast({
                                  title: "File too large",
                                  description:
                                    "Please select an image smaller than 2MB",
                                  variant: "destructive",
                                });
                                return;
                              }

                              // Validate file type
                              if (!file.type.startsWith("image/")) {
                                toast({
                                  title: "Invalid file type",
                                  description:
                                    "Please select a valid image file",
                                  variant: "destructive",
                                });
                                return;
                              }

                              try {
                                setLogoFile(file);
                                const url = URL.createObjectURL(file);
                                setLogoPreview(url);

                                // Convert to base64
                                const base64 = await convertFileToBase64(file);
                                setLogoBase64(base64);
                              } catch (error) {
                                console.error(
                                  "Failed to process image:",
                                  error
                                );
                                toast({
                                  title: "Error",
                                  description:
                                    "Failed to process the selected image",
                                  variant: "destructive",
                                });
                              }
                            }}
                          />
                        </label>
                        <p className="text-xs text-muted-foreground text-center">
                          PNG, JPG, SVG up to 2MB
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Organization Details */}
                  <div className="lg:col-span-2">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-semibold text-foreground mb-4">
                          Basic Information
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
                            <div className="space-y-3">
                              {/* Domain Restriction Toggle */}
                              <div
                                className="flex items-center gap-3 bg-muted/20 rounded-lg p-3 border"
                                style={{
                                  borderColor: "#E3DDD7",
                                  borderWidth: "1px",
                                }}
                              >
                                <Switch
                                  checked={restrictToDomain}
                                  onCheckedChange={setRestrictToDomain}
                                  id="domain-restriction"
                                />
                                <div className="flex-1">
                                  <label
                                    htmlFor="domain-restriction"
                                    className="text-sm font-medium text-foreground cursor-pointer block"
                                  >
                                    Open for domain emails
                                  </label>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    When enabled, users with matching email
                                    domains can automatically join this
                                    organization
                                  </p>
                                </div>
                              </div>

                              {/* Domain Input - Only shown when restriction is enabled */}
                              {restrictToDomain && (
                                <div className="space-y-2">
                                  <Input
                                    value={domain}
                                    onChange={(e) => setDomain(e.target.value)}
                                    placeholder="company.com"
                                    className="font-mono text-sm h-11 border focus:border-primary"
                                    style={{
                                      borderColor: "#E3DDD7",
                                      borderWidth: "1px",
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Save Button */}
                      <div className="pt-4 border-t border-border/50">
                        <Button
                          size="sm"
                          onClick={handleSaveChanges}
                          disabled={isSaving || !name.trim()}
                          className="h-10 px-6"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Members Section */}
          {!isEditor && (
            <motion.div
              variants={sectionVariants}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: 0.05 }}
            >
              <Card className="card-hover shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-4 h-4" /> Members
                  </CardTitle>
                  <CardDescription>
                    {isAdmin
                      ? "Invite and manage team members"
                      : "Invite team members as editors or members"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Input
                        value={inviteEmail}
                        onChange={handleEmailChange}
                        placeholder="Enter email to invite..."
                        className={`border ${
                          emailError
                            ? "border-red-500 focus:border-red-500"
                            : "border-muted-foreground/40"
                        }`}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleInviteUser();
                          }
                        }}
                      />
                      {emailError && (
                        <p className="text-sm text-red-500 mt-1">
                          {emailError}
                        </p>
                      )}
                    </div>

                    {/* Category Select */}
                    <Select
                      value={inviteCategory}
                      onValueChange={(v) => setInviteCategory(v)}
                    >
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {(organization.usercategories || []).map((cat) => (
                          <SelectItem key={cat._id} value={cat.categoryName}>
                            {cat.categoryName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={openManageCategories}
                      aria-label="Manage categories"
                      title="Manage categories"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>

                    {/* Role Select */}
                    <Select
                      value={inviteRole}
                      onValueChange={(v) => setInviteRole(v)}
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">Member</SelectItem>
                        {isAdmin && (
                          <SelectItem value="moderator">Moderator</SelectItem>
                        )}
                        <SelectItem value="editor">Editor</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      size="sm"
                      onClick={handleInviteUser}
                      disabled={
                        isInviting || !inviteEmail.trim() || !!emailError
                      }
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      {isInviting ? "Inviting..." : "Invite"}
                    </Button>
                  </div>
                  <Dialog
                    open={isManageCategoriesOpen}
                    onOpenChange={setIsManageCategoriesOpen}
                  >
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Manage Categories</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="max-h-64 rounded-md border p-2 overflow-y-auto scrollbar-transparent">
                          {(editedCategories || []).length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                              No categories yet.
                            </p>
                          ) : (
                            <ul className="space-y-2">
                              {editedCategories.map((cat, idx) => (
                                <li
                                  key={`${cat._id}-${idx}`}
                                  className="flex items-center justify-between gap-3 rounded-md bg-muted/40 px-3 py-2"
                                >
                                  {renamingIndex === idx ? (
                                    <div className="flex items-center gap-2 flex-1">
                                      <Input
                                        value={renameValue}
                                        onChange={(e) =>
                                          setRenameValue(e.target.value)
                                        }
                                        className="h-8"
                                      />
                                    </div>
                                  ) : (
                                    <div className="flex-1">
                                      <span className="text-sm font-medium truncate">
                                        {cat.categoryName}
                                      </span>
                                      <div className="text-xs text-muted-foreground">
                                        {cat.users.length} user
                                        {cat.users.length !== 1 ? "s" : ""}
                                      </div>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-2">
                                    {renamingIndex === idx ? (
                                      <>
                                        <Button
                                          variant="outline"
                                          size="icon"
                                          className="h-8 w-8"
                                          onClick={saveRenameCategory}
                                          aria-label="Save"
                                        >
                                          <Check className="w-4 h-4" />
                                        </Button>
                                        <Button
                                          variant="outline"
                                          size="icon"
                                          className="h-8 w-8"
                                          onClick={cancelRenameCategory}
                                          aria-label="Cancel"
                                        >
                                          <X className="w-4 h-4" />
                                        </Button>
                                      </>
                                    ) : (
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => startRenameCategory(idx)}
                                        aria-label={`Rename ${cat.categoryName}`}
                                      >
                                        <Edit className="w-4 h-4" />
                                      </Button>
                                    )}
                                    <Button
                                      variant="destructive"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() =>
                                        handleRemoveEditedCategory(idx)
                                      }
                                      aria-label={`Remove ${cat.categoryName}`}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            value={newEditedCategory}
                            onChange={(e) =>
                              setNewEditedCategory(e.target.value)
                            }
                            placeholder="New category"
                            className="border border-muted-foreground/40"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleAddEditedCategory();
                              }
                            }}
                          />
                          <Button
                            size="sm"
                            onClick={handleAddEditedCategory}
                            disabled={!newEditedCategory.trim()}
                            className="gap-1"
                          >
                            <Plus className="w-4 h-4" /> Add
                          </Button>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsManageCategoriesOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleSaveEditedCategories}>
                          Save
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {isLoadingMembers ? (
                    <div className="space-y-3 rounded-md border p-3">
                      {Array.from({ length: 3 }).map((_, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-5 w-16 rounded-full" />
                          </div>
                          <Skeleton className="h-8 w-8 rounded-md" />
                        </div>
                      ))}
                    </div>
                  ) : organization.members?.length ||
                    organization.pendingMembers?.length ? (
                    <div className="relative">
                      {isProcessingAction && (
                        <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-md">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600 dark:border-gray-600 dark:border-t-gray-300"></div>
                            Processing...
                          </div>
                        </div>
                      )}
                      <ul className="divide-y rounded-md border overflow-visible">
                        {/*  Members */}
                        {organization.members?.map((member, idx) => {
                          const role = member.roles?.[0];
                          const normalizedRole = role || "member";
                          const openUp = idx >= Math.max(0, (organization.members?.length || 0) - 2);
                          return (
                            <motion.li
                              key={`pending-${member.email}`}
                              variants={listItemVariants}
                              initial="initial"
                              whileInView="animate"
                              viewport={{ once: true }}
                              transition={{ duration: 0.25, delay: idx * 0.05 }}
                              className="flex items-center justify-between px-3 py-2 bg-card"
                            >
                              <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3">
                                  <span className="text-sm text-foreground">
                                    {member.email}
                                  </span>
                                  {role === "organizationAdmin" && (
                                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full flex items-center gap-1">
                                      <Crown className="w-3 h-3" />
                                      Owner
                                    </span>
                                  )}
                                  {role === "moderator" && (
                                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full flex items-center gap-1">
                                      <Shield className="w-3 h-3" />
                                      Moderator
                                    </span>
                                  )}
                                  {role === "editor" && (
                                    <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full flex items-center gap-1">
                                      <UserCheck className="w-3 h-3" />
                                      Editor
                                    </span>
                                  )}
                                </div>
                                {/* User Categories */}
                                {member.categories &&
                                  normalizedRole === "member" &&
                                  member.categories.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                      {member.categories.map(
                                        (category, catIdx) => (
                                          <span
                                            key={catIdx}
                                            className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                                          >
                                            {category}
                                          </span>
                                        )
                                      )}
                                    </div>
                                  )}
                              </div>
                              <div className="flex items-center gap-2">
                                {/* Edit Categories Button - Only for members */}
                                {(isAdmin || isModerator) &&
                                  normalizedRole === "member" && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        handleEditUserClick(member)
                                      }
                                      className="h-8 w-8 p-0 text-muted-foreground hover:text-blue-600"
                                      title="Edit Categories"
                                    >
                                      <Pencil className="w-4 h-4" />
                                    </Button>
                                  )}

                                {role !== "organizationAdmin" &&
                                  (isAdmin ||
                                    (isModerator &&
                                      (normalizedRole === "member" ||
                                        normalizedRole === "editor"))) && (
                                    <Menu as="div" className="relative">
                                      <Menu.Button as={Fragment}>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="h-8 w-8 p-0"
                                        >
                                          <MoreHorizontal className="w-4 h-4" />
                                          <span className="sr-only">
                                            Open menu
                                          </span>
                                        </Button>
                                      </Menu.Button>

                                      <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                      >
                                        <Menu.Items className={`absolute right-0 ${openUp ? "bottom-8 origin-bottom-right" : "top-8 origin-top-right"} w-48 max-h-64 overflow-auto bg-white dark:bg-gray-800 border rounded-md shadow-lg z-50 focus:outline-none`}>
                                          <div className="py-1">
                                            <>
                                              {isAdmin && (
                                                <>
                                                  {role === "moderator" ? (
                                                    <Menu.Item>
                                                      {({ active }) => (
                                                        <button
                                                          onClick={() => {
                                                            handleDemoteFromModeratorClick(
                                                              member.email
                                                            );
                                                          }}
                                                          className={`${
                                                            active
                                                              ? "bg-orange-50 dark:bg-orange-900/20"
                                                              : ""
                                                          } flex items-center gap-2 w-full px-3 py-2 text-sm text-left text-orange-600 cursor-pointer`}
                                                        >
                                                          <Shield className="w-4 h-4" />
                                                          Demote from Moderator
                                                        </button>
                                                      )}
                                                    </Menu.Item>
                                                  ) : (
                                                    <Menu.Item>
                                                      {({ active }) => (
                                                        <button
                                                          onClick={() => {
                                                            handlePromoteToModeratorClick(
                                                              member.email
                                                            );
                                                          }}
                                                          className={`${
                                                            active
                                                              ? "bg-gray-100 dark:bg-gray-700"
                                                              : ""
                                                          } flex items-center gap-2 w-full px-3 py-2 text-sm text-left cursor-pointer`}
                                                        >
                                                          <Shield className="w-4 h-4" />
                                                          Make Moderator
                                                        </button>
                                                      )}
                                                    </Menu.Item>
                                                  )}
                                                </>
                                              )}
                                              {isAdmin && (
                                                <>
                                                  {role === "editor" ? (
                                                    <Menu.Item>
                                                      {({ active }) => (
                                                        <button
                                                          onClick={() => {
                                                            handleDemoteFromEditorClick(
                                                              member.email
                                                            );
                                                          }}
                                                          className={`${
                                                            active
                                                              ? "bg-orange-50 dark:bg-orange-900/20"
                                                              : ""
                                                          } flex items-center gap-2 w-full px-3 py-2 text-sm text-left text-orange-600 cursor-pointer`}
                                                        >
                                                          <UserCheck className="w-4 h-4" />
                                                          Demote from Editor
                                                        </button>
                                                      )}
                                                    </Menu.Item>
                                                  ) : (
                                                    <Menu.Item>
                                                      {({ active }) => (
                                                        <button
                                                          onClick={() => {
                                                            handlePromoteToEditorFromInvitedClick(
                                                              member.email
                                                            );
                                                          }}
                                                          className={`${
                                                            active
                                                              ? "bg-gray-100 dark:bg-gray-700"
                                                              : ""
                                                          } flex items-center gap-2 w-full px-3 py-2 text-sm text-left cursor-pointer`}
                                                        >
                                                          <UserCheck className="w-4 h-4" />
                                                          Make Editor
                                                        </button>
                                                      )}
                                                    </Menu.Item>
                                                  )}
                                                </>
                                              )}

                                              {isModerator &&
                                                normalizedRole === "member" && (
                                                  <Menu.Item>
                                                    {({ active }) => (
                                                      <button
                                                        onClick={() => {
                                                          handlePromoteToEditorFromInvitedClick(
                                                            member.email
                                                          );
                                                        }}
                                                        className={`${
                                                          active
                                                            ? "bg-gray-100 dark:bg-gray-700"
                                                            : ""
                                                        } flex items-center gap-2 w-full px-3 py-2 text-sm text-left cursor-pointer`}
                                                      >
                                                        <UserCheck className="w-4 h-4" />
                                                        Make Editor
                                                      </button>
                                                    )}
                                                  </Menu.Item>
                                                )}

                                              {isModerator &&
                                                normalizedRole === "editor" && (
                                                  <Menu.Item>
                                                    {({ active }) => (
                                                      <button
                                                        onClick={() => {
                                                          handleDemoteFromEditorClick(
                                                            member.email
                                                          );
                                                        }}
                                                        className={`${
                                                          active
                                                            ? "bg-orange-50 dark:bg-orange-900/20"
                                                            : ""
                                                        } flex items-center gap-2 w-full px-3 py-2 text-sm text-left text-orange-600 cursor-pointer`}
                                                      >
                                                        <UserCheck className="w-4 h-4" />
                                                        Demote from Editor
                                                      </button>
                                                    )}
                                                  </Menu.Item>
                                                )}

                                              {(isAdmin ||
                                                (isModerator &&
                                                  normalizedRole ===
                                                    "member")) && (
                                                <Menu.Item>
                                                  {({ active }) => (
                                                    <button
                                                      onClick={() => {
                                                        setRemoveTarget({
                                                          userId: member._id,
                                                          email: member.email,
                                                        });
                                                        setShowRemoveDialog(
                                                          true
                                                        );
                                                      }}
                                                      className={`${
                                                        active
                                                          ? "bg-red-50 dark:bg-red-900/20"
                                                          : ""
                                                      } flex items-center gap-2 w-full px-3 py-2 text-sm text-left text-red-600 cursor-pointer`}
                                                    >
                                                      <UserX className="w-4 h-4" />
                                                      Remove from Organization
                                                    </button>
                                                  )}
                                                </Menu.Item>
                                              )}
                                            </>
                                          </div>
                                        </Menu.Items>
                                      </Transition>
                                    </Menu>
                                  )}
                              </div>
                            </motion.li>
                          );
                        })}
                        {/* Pending Members */}
                        {organization.pendingMembers?.map((member, idx) => {
                          const role = member.userRole;
                          const openUp = idx >= Math.max(0, (organization.pendingMembers?.length || 0) - 2);
                          return (
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
                                {role === "organizationAdmin" && (
                                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full flex items-center gap-1">
                                    <Crown className="w-3 h-3" />
                                    Owner
                                  </span>
                                )}
                                {role === "moderator" && (
                                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full flex items-center gap-1">
                                    <Shield className="w-3 h-3" />
                                    Moderator
                                  </span>
                                )}
                                {role === "editor" && (
                                  <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full flex items-center gap-1">
                                    <UserCheck className="w-3 h-3" />
                                    Editor
                                  </span>
                                )}
                                {member.status === "pending" && (
                                  <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full flex items-center gap-1">
                                    Pending
                                  </span>
                                )}
                              </div>
                              <Menu as="div" className="relative">
                                <Menu.Button as={Fragment}>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    <MoreHorizontal className="w-4 h-4" />
                                    <span className="sr-only">Open menu</span>
                                  </Button>
                                </Menu.Button>

                                <Transition
                                  as={Fragment}
                                  enter="transition ease-out duration-100"
                                  enterFrom="transform opacity-0 scale-95"
                                  enterTo="transform opacity-100 scale-100"
                                  leave="transition ease-in duration-75"
                                  leaveFrom="transform opacity-100 scale-100"
                                  leaveTo="transform opacity-0 scale-95"
                                >
                                  <Menu.Items className={`absolute right-0 ${openUp ? "bottom-8 origin-bottom-right" : "top-8 origin-top-right"} w-48 max-h-64 overflow-auto bg-white dark:bg-gray-800 border rounded-md shadow-lg z-50 focus:outline-none`}>
                                    <div className="py-1">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          handleResendInviteClick(
                                            member._id,
                                            member.email
                                          );
                                        }}
                                        disabled={isProcessingAction}
                                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-green-50 dark:hover:bg-green-900/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                      >
                                        <Mail className="w-4 h-4" />
                                        {isProcessingAction
                                          ? "Sending..."
                                          : "Resend Invitation"}
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          setCancelInviteTarget({
                                            inviteId: member._id,
                                            email: member.email,
                                          });
                                          setShowCancelInviteDialog(true);
                                        }}
                                        disabled={isProcessingAction}
                                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                      >
                                        <UserX className="w-4 h-4" />
                                        Cancel Invitation
                                      </button>
                                    </div>
                                  </Menu.Items>
                                </Transition>
                              </Menu>
                            </motion.li>
                          );
                        })}
                      </ul>
                    </div>
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
          )}

          {/* Danger Zone */}
          {isAdmin && (
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
                    Irreversible actions for this organization
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Delete this organization and all its data permanently.
                  </p>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteOrganization}
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Delete Organization
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </main>

        <Toaster />
        <ConfirmDialog
          open={showRemoveDialog}
          onOpenChange={setShowRemoveDialog}
          title="Remove member?"
          description="This action cannot be undone. The user will immediately lose access to this organization."
          confirmLabel="Remove"
          cancelLabel="Cancel"
          onConfirm={async () => {
            if (removeTarget) {
              await handleRemoveInvitedUserClick(
                removeTarget.userId,
                removeTarget.email
              );
              setRemoveTarget(null);
            }
          }}
        />
        <ConfirmDialog
          open={showCancelInviteDialog}
          onOpenChange={setShowCancelInviteDialog}
          title="Cancel invitation?"
          description="This will revoke the user's pending invite. They will not be able to join unless re-invited."
          confirmLabel="Cancel Invite"
          cancelLabel="Keep Invite"
          onConfirm={async () => {
            if (cancelInviteTarget) {
              await cancelInviteClick(
                cancelInviteTarget.inviteId,
                cancelInviteTarget.email
              );
              setCancelInviteTarget(null);
            }
          }}
        />
        <ConfirmDialog
          open={showDeleteOrgDialog}
          onOpenChange={setShowDeleteOrgDialog}
          title="Delete Organization?"
          description={`Are you sure you want to delete "${organization.name}"? This action cannot be undone. All data, members, and settings will be permanently removed.`}
          confirmLabel={isDeletingOrg ? "Deleting..." : "Delete Organization"}
          cancelLabel="Cancel"
          onConfirm={confirmDeleteOrganization}
          isLoading={isDeletingOrg}
        />

        {/* Edit User Categories Dialog */}
        <Dialog open={showEditUserDialog} onOpenChange={setShowEditUserDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit User Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {editingUser && (
                <>
                  <div className="text-sm text-muted-foreground">
                    Editing category for:{" "}
                    <span className="font-medium">{editingUser.email}</span>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium">Category</label>
                    <Select
                      value={selectedUserCategory}
                      onValueChange={(value) => setSelectedUserCategory(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No category</SelectItem>
                        {(organization.usercategories || []).map((category) => (
                          <SelectItem
                            key={category._id}
                            value={category.categoryName}
                          >
                            {category.categoryName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {(organization.usercategories || []).length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        No categories available
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleCancelEditUser}
                disabled={isUpdatingUserCategories}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateUserCategories}
                disabled={isUpdatingUserCategories}
              >
                {isUpdatingUserCategories ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Updating...
                  </>
                ) : (
                  "Update Category"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminGuard>
  );
}
