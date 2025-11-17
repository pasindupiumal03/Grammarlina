"use client";

import { useEffect, useState, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Menu, Transition } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import AppHeader from "@/components/AppHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { jwtDecrypt } from "jose";
import {
  Shield,
  Chrome,
  AlertCircle,
  Download,
  Info,
  Loader2,
  Plus,
  Crown,
  ChevronDown,
  MoreHorizontal,
  UserCheck,
  UserX,
  Users,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import ConfirmDialog from "@/components/ConfirmDialog";
import { authSelector, logout, setAuth } from "@/lib/slices/auth-slice";
import { RootState } from "@/lib/store";
import { getMe, logoutUser } from "@/api/auth";
import {
  organizationSelector,
  setOrganization,
  setIsLoading,
  setServices,
  clearOrganizationState,
} from "@/lib/slices/organization-slice";
import { getOrganization } from "@/api/organization";
import {
  deleteService,
  getEncryptionKeys,
  getServiceById,
} from "@/api/services";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

// Server-provided cookies via API; no local JSON in client bundle
const EXTENSION_ID = process.env.NEXT_PUBLIC_EXTENSION_ID;

type Service = {
  _id: string;
  name: string;
  domain: string;
  category: string;
  logo: string;
  tags: string[];
};

// Using OrganizationModel from auth slice
type Organization = {
  _id: string;
  name: string;
  organizationAdmin: string;
  members: string[];
  cookies: any[];
  logo?: string;
  isActive?: boolean;
};

export default function CookieDashboard() {
  const dispatch = useDispatch();
  const authState = useSelector(authSelector);
  const organizationState = useSelector(organizationSelector);
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null);
  const [activeOrganizationId, setActiveOrganizationId] = useState<
    string | null
  >(authState.organizations.length > 0 ? authState.organizations[0]._id : null);
  const [showDeleteServiceDialog, setShowDeleteServiceDialog] =
    useState<boolean>(false);
  const [deleteServiceTarget, setDeleteServiceTarget] =
    useState<Service | null>(null);
  const { toast } = useToast();

  // Get organizations from Redux auth state
  const organizations: Organization[] = authState.organizations.map((org) => ({
    ...org,
    isActive: org._id === activeOrganizationId,
  }));
  const isAdmin = organizationState.organizationAdmin._id === authState._id;
  const isModerator = organizationState.moderators.some(
    (moderator) => moderator._id === authState._id
  );
  const isEditor = organizationState.editors.some(
    (editor) => editor._id === authState._id
  );

  // Get services from organization state
  const services: Service[] = organizationState.services || [];
  const servicesLoading = organizationState.isLoading;
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [tagFilter, setTagFilter] = useState<string | null>(null);

  const filteredServices = services.filter((service) => {
    const query = searchQuery.trim().toLowerCase();
    const tags = Array.isArray(service.tags) ? service.tags : [];

    if (
      tagFilter &&
      !tags.some((t) => t.toLowerCase() === tagFilter.toLowerCase())
    ) {
      return false;
    }

    if (!query) return true;

    const haystacks = [
      service.name || "",
      service.domain || "",
      service.category || "",
    ].map((s) => s.toLowerCase());

    const tagMatch = tags.some((t) => t.toLowerCase().includes(query));
    const textMatch = haystacks.some((s) => s.includes(query));
    return textMatch || tagMatch;
  });

  const handleSignOut = async () => {
    // Clear any local storage or session data if needed
    try {
      const logoutResponse = await logoutUser();
      localStorage.clear();
      sessionStorage.clear();
      dispatch(clearOrganizationState());
      dispatch(logout());

      setTimeout(() => {
        window.location.href = "/";
      }, 1000);

      toast({
        title: "Signed Out",
        description: "You have been signed out successfully.",
      });
    } catch (error) {}
  };

  const handleOrganizationSelect = (orgId: string) => {
    setActiveOrganizationId(orgId);
    toast({
      title: "Organization Selected",
      description: `Switched to ${
        organizations.find((org) => org._id === orgId)?.name
      }`,
    });
  };

  const handleAddOrganization = () => {
    toast({
      title: "Add Organization",
      description: "Redirecting to organization creation page...",
    });
    // Navigate to create organization page
    window.location.href = "/create-organization";
  };

  useEffect(() => {
    const getUser = async () => {
      const userResponse = await getMe();
      dispatch(
        setAuth({
          ...userResponse.user,
        })
      );

      const organizations = userResponse.user.organizations;
      setActiveOrganizationId(organizations[0]?._id);
      // dispatch(setOrganization(organizations[0]));
    };
    getUser();
  }, []);

  useEffect(() => {
    if (activeOrganizationId) {
      const handleGetOrganization = async () => {
        const { organization } = await getOrganization(activeOrganizationId);
        dispatch(setOrganization(organization));
        dispatch(setIsLoading(false));
      };
      handleGetOrganization();
    }
  }, [activeOrganizationId]);

  const handleDeleteServiceClick = async () => {
    try {
      dispatch(setIsLoading(true));
      if (deleteServiceTarget) {
        const res = await deleteService({
          serviceId: deleteServiceTarget._id,
          organizationId: organizationState._id,
        });
        dispatch(setIsLoading(false));
        toast({
          title: "Success",
          description: "Service deleted successfully.",
        });
        setShowDeleteServiceDialog(false);
        setDeleteServiceTarget(null);

        const updatedServices = organizationState.services?.filter(
          (service) => service._id !== deleteServiceTarget._id
        );
        dispatch(setServices(updatedServices || []));
      }
    } catch (err) {
      dispatch(setIsLoading(false));
      toast({
        title: "Error",
        description: "Unable to delete service.",
        variant: "destructive",
      });
    }
  };

  const handleServiceClick = async (service: Service) => {
    if (activeServiceId !== null) return;
    setActiveServiceId(service._id);
    try {
      const params = {
        serviceId: service._id,
        organizationId: organizationState._id,
      };
      const { keys } = await getEncryptionKeys(organizationState._id);
      const res = await getServiceById(params);
      if (!res.service) {
        toast({
          title: "Error",
          description: "Unable to open service.",
          variant: "destructive",
        });
      }

      const decryptedCookies = await decryptCookies(
        res.service.encryptedCookies,
        keys.privateKeyTwo
      );
      console.log({ decryptedCookies });

      await sendToExtension(service, decryptedCookies);

      // const res = await fetch(
      //   `/api/cookies/${service._id}?id=${encodeURIComponent(service._id)}`,
      //   { cache: "no-store" }
      // );
      // if (!res.ok) throw new Error(`Failed to load cookies: ${res.status}`);
      // const { ciphertext, iv } = await res.json();
      // if (!ciphertext || !iv) throw new Error("Invalid encrypted payload");
      // const cookies = await decryptCookies(ciphertext, iv);
      // if (!Array.isArray(cookies)) throw new Error("Decryption failed");
      // await sendToExtension(service, cookies);
    } catch (err) {
      console.error(err);
      const errorMessage =
        err instanceof Error ? err.message : "Unable to open service.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setActiveServiceId(null);
    }
  };

  const sendToExtension = async (service: Service, cookies: any) => {
    // Open the service URL in a new tab
    // window.open(service.domain, "_blank")

    const chromeApi = (window as any).chrome;
    const payload = {
      url: `https://${service.domain}`,
      cookies: cookies.cookies,
    };
    if (chromeApi?.runtime?.sendMessage) {
      try {
        chromeApi.runtime.sendMessage(EXTENSION_ID, payload, () => {
          const lastError = chromeApi.runtime?.lastError;
          if (lastError) {
            console.warn("Extension message error:", lastError.message);
          }
        });
        return;
      } catch (err) {
        console.warn(
          "Failed to send via chrome.runtime.sendMessage, falling back to postMessage.",
          err
        );
      }
    }
    console.log(EXTENSION_ID, payload);
    window.postMessage(
      { source: "cookie-export-website", type: "SEND_COOKIES", payload },
      "*"
    );

    toast({
      title: "Opening Tool",
      description: `${service.name} opened in a new tab. Wait 10 seconds for automatic login.`,
    });

    console.log(`Opened ${service.name} in new tab:`, service.domain);
  };

  // async function decryptCookies(
  //   ciphertextB64: string,
  //   ivB64: string
  // ): Promise<unknown[]> {
  //   try {
  //     const keyB64 = process.env.NEXT_PUBLIC_COOKIES_ENCRYPTION_KEY;
  //     if (!keyB64)
  //       throw new Error("Missing NEXT_PUBLIC_COOKIES_ENCRYPTION_KEY");
  //     const keyBytes = Uint8Array.from(atob(keyB64), (c) => c.charCodeAt(0));
  //     if (![16, 24, 32].includes(keyBytes.length))
  //       throw new Error("Invalid key length");
  //     const cryptoKey = await window.crypto.subtle.importKey(
  //       "raw",
  //       keyBytes,
  //       { name: "AES-GCM" },
  //       false,
  //       ["decrypt"]
  //     );
  //     const iv = Uint8Array.from(atob(ivB64), (c) => c.charCodeAt(0));
  //     const ciphertext = Uint8Array.from(atob(ciphertextB64), (c) =>
  //       c.charCodeAt(0)
  //     );
  //     const plaintextBuf = await window.crypto.subtle.decrypt(
  //       { name: "AES-GCM", iv },
  //       cryptoKey,
  //       ciphertext
  //     );
  //     const json = new TextDecoder().decode(plaintextBuf);
  //     return JSON.parse(json);
  //   } catch (e) {
  //     console.error("decryptCookies error", e);
  //     return [];
  //   }
  // }

  const decryptCookies = async (cookies: string, privateKey: string) => {
    console.log(cookies, privateKey);
    try {
      // Validate input
      if (!cookies || typeof cookies !== "string") {
        throw new Error(
          "Invalid JWE token: cookies parameter is required and must be a string"
        );
      }

      // Convert private key to CryptoKey
      let key: CryptoKey;

      if (privateKey.includes("-----BEGIN")) {
        // PEM format - convert to CryptoKey
        const pemContents = privateKey
          .replace(/-----BEGIN PRIVATE KEY-----/g, "")
          .replace(/-----END PRIVATE KEY-----/g, "")
          .replace(/\s/g, "");

        const binaryDer = Uint8Array.from(atob(pemContents), (c) =>
          c.charCodeAt(0)
        );

        key = await crypto.subtle.importKey(
          "pkcs8",
          binaryDer,
          {
            name: "RSA-OAEP",
            hash: "SHA-256",
          },
          false,
          ["decrypt"]
        );
      } else {
        // Raw key - convert to CryptoKey
        const keyBuffer = new TextEncoder().encode(privateKey);
        key = await crypto.subtle.importKey(
          "raw",
          keyBuffer,
          { name: "AES-GCM" },
          false,
          ["decrypt"]
        );
      }

      // Use jose library to decrypt the JWE
      // Add clockTolerance to handle minor clock skew issues (30 seconds)
      const { payload } = await jwtDecrypt(cookies, key, {
        clockTolerance: 30, // Allow 30 seconds of clock skew
      });

      // Return the decrypted payload
      return payload;
    } catch (error: any) {
      console.error("Error decrypting cookies:", error);

      // Handle expired JWT tokens specifically
      // In jose v6, errors have a 'code' property instead of being specific error classes
      const isExpiredError =
        error?.code === "ERR_JWT_EXPIRED" ||
        error?.message?.includes("exp") ||
        error?.message?.includes("expired") ||
        error?.message?.includes("JWTExpired");

      if (isExpiredError) {
        // The JWT token has expired - throw a user-friendly error message
        throw new Error(
          "The encrypted cookies have expired. Please contact your organization administrator to refresh the service cookies."
        );
      }

      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Failed to decrypt cookies: ${errorMessage}`);
    }
  };

  const handleExtensionDownload = () => {
    const downloadUrl =
      "https://drive.google.com/drive/u/6/folders/1kKBNOQ17EgVHi2UJgEtqzOJJaobho2n4";
    window.open(downloadUrl, "_blank");

    toast({
      title: "Extension Download",
      description: "Opening Chrome Web Store in a new tab.",
    });
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Sidebar */}
      <div className="w-24 bg-card border-r flex flex-col items-center py-6 gap-4">
        {/* Organization Buttons */}
        {organizations.map((org) => (
          <button
            key={org._id}
            onClick={() => handleOrganizationSelect(org._id)}
            className={`w-16 h-16 rounded-full border-2 transition-all duration-200 hover:scale-105 ${
              org.isActive
                ? "border-primary bg-primary/10 shadow-lg"
                : "border-muted-foreground/30 bg-muted/50 hover:border-primary/50"
            }`}
            title={org.name}
          >
            {org.logo && (
              <Image
                src={org.logo}
                alt={org.name}
                width={48}
                height={48}
                className="w-full rounded-full object-cover flex justify-center items-center"
              />
            )}
            {!org.logo && (
              <div className="w-full h-full rounded-full bg-muted flex items-center justify-center">
                <p className="text-3xl font-extrabold text-muted-foreground">
                  {org.name?.charAt(0)}
                </p>
              </div>
            )}
          </button>
        ))}

        {/* Add Organization Button */}
        {isAdmin && (
          <button
            onClick={handleAddOrganization}
            className="w-16 h-16 rounded-full border-2 border-dashed border-muted-foreground/50 bg-muted/30 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 hover:scale-105 flex items-center justify-center"
            title="Add Organization"
          >
            <Plus className="w-6 h-6 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <AppHeader
          title="Grammarlina"
          subtitle="Browser extension tool dashboard"
          variant="dashboard"
          showManageButton={true}
          onManageClick={() => (window.location.href = "/manage-organizations")}
          showSignOutButton={true}
          onSignOutClick={handleSignOut}
          isAdmin={isAdmin}
          isEditor={isEditor}
          isModerator={isModerator}
          userInfo={{
            name: authState.name,
            email: authState.email,
          }}
        />

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Service Dashboard
                </h2>
                <p className="text-muted-foreground">
                  Click on a service to open it in a new tab with automatic
                  login
                </p>
              </div>
              <div className="w-full sm:w-auto flex items-center gap-2 justify-end">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search services, domains, categories, or tags..."
                  className="h-10 w-full sm:w-80"
                />
                {tagFilter && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTagFilter(null)}
                    className="whitespace-nowrap"
                    title="Clear tag filter"
                  >
                    Clear tag: {tagFilter}
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesLoading
              ? Array.from({ length: 6 }).map((_, idx) => (
                  <Card key={`skeleton-${idx}`} className="border-2">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                          <Skeleton className="w-8 h-8 rounded-md" />
                        </div>
                      </div>
                      <div className="space-y-2 mt-2">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-56" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-10 w-full" />
                    </CardContent>
                  </Card>
                ))
              : filteredServices.map((service) => {
                  return (
                    <Card
                      key={service._id}
                      className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-2 hover:border-primary/20"
                      onClick={() => {
                        if (activeServiceId === null)
                          handleServiceClick(service);
                      }}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                            <img
                              src={service.logo}
                              alt={service.name}
                              className="w-8 h-8"
                            />
                          </div>
                          {(isAdmin || isModerator) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteServiceTarget(service);
                                setShowDeleteServiceDialog(true);
                              }}
                              className="inline-flex items-center justify-center h-8 w-8 rounded-md border text-muted-foreground hover:text-red-600 hover:border-red-300 hover:bg-red-50 transition-colors"
                              title="Delete Service"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-lg group-hover:text-primary transition-colors">
                            {service.name}
                          </CardTitle>
                          {service.category ? (
                            <CardDescription className="text-sm">
                              {service.category}
                            </CardDescription>
                          ) : null}
                          {service.tags && service.tags.length > 0 ? (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {service.tags.map((tag, idx) => (
                                <Badge
                                  key={`${service._id}-tag-${idx}`}
                                  variant="secondary"
                                  className="cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setTagFilter(tag);
                                  }}
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Button
                          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors bg-transparent"
                          variant="outline"
                          disabled={activeServiceId === service._id}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (activeServiceId === null)
                              handleServiceClick(service);
                          }}
                          aria-busy={activeServiceId === service._id}
                        >
                          {activeServiceId === service._id ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Opening...
                            </>
                          ) : (
                            <>
                              Open in a new tab
                              <Chrome className="w-4 h-4 ml-2" />
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
          </div>

          <div className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Instructions
                </CardTitle>
                <CardDescription>Steps to use the extension</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <p className="text-sm font-medium text-yellow-800">
                      Important: Keep your sessions active on all tool websites.
                      **DO NOT log out from any shared tool.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                      1
                    </div>
                    <p className="text-sm">
                      Go to Chrome's extensions page or visit
                      chrome://extensions/ in the address bar
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                      2
                    </div>
                    <p className="text-sm">
                      Enable Developer mode using the top-right toggle button
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                      3
                    </div>
                    <p className="text-sm">Download the extension files</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                      4
                    </div>
                    <p className="text-sm">
                      Install the Grammarlina Helper first and then the Grammarlina extension after
                      that
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                      5
                    </div>
                    <p className="text-sm">
                      Click on the above tools to open them in a new tab
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                      6
                    </div>
                    <p className="text-sm">
                      Wait for 10 seconds for the extension to Log you in to the
                      tool automatically (if not contact support)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Download Extensions
                </CardTitle>
                <CardDescription>
                  Download the Grammarlina browser extension to use with this
                  dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleExtensionDownload}
                  className="h-12 justify-start w-full sm:w-auto bg-transparent"
                  variant="outline"
                >
                  <Chrome className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Chrome Extension</div>
                    <div className="text-xs text-muted-foreground">
                      For Chrome & Edge browsers
                    </div>
                  </div>
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>

        <Toaster />
        <ConfirmDialog
          open={showDeleteServiceDialog}
          onOpenChange={setShowDeleteServiceDialog}
          title="Delete service?"
          description="This will remove the service from your organization. This action cannot be undone."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={async () => {
            if (deleteServiceTarget) {
              handleDeleteServiceClick();
            }
          }}
        />
      </div>
    </div>
  );
}
