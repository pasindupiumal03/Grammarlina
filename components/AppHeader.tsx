"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "framer-motion";
import { Settings, LogOut, ArrowLeft, Building2, Sparkles, User, Crown, Shield, UserCheck } from "lucide-react";

interface AppHeaderProps {
  title: string;
  subtitle: string;
  variant?: "dashboard" | "organization";
  organizationName?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  showManageButton?: boolean;
  onManageClick?: () => void;
  showSignOutButton?: boolean;
  onSignOutClick?: () => void;
  isAdmin?: boolean;
  isModerator?: boolean;
  isEditor?: boolean;
  userInfo?: {
    name: string | null;
    email: string | null;
  };
}

export default function AppHeader({
  title,
  subtitle,
  variant = "dashboard",
  organizationName,
  showBackButton = false,
  onBackClick,
  showManageButton = false,
  onManageClick,
  showSignOutButton = false,
  onSignOutClick,
  isAdmin = false,
  isModerator = false,
  isEditor = false,
  userInfo,
}: AppHeaderProps) {
  const canShowManageButton = showManageButton && (isAdmin || isModerator);
  
  // Determine user role for display
  const getUserRole = () => {
    if (isAdmin) return { label: "Owner", icon: Crown, color: "text-green-600" };
    if (isModerator) return { label: "Moderator", icon: Shield, color: "text-blue-600" };
    if (isEditor) return { label: "Editor", icon: UserCheck, color: "text-purple-600" };
    return { label: "Member", icon: User, color: "text-gray-600" };
  };

  const userRole = getUserRole();
  const RoleIcon = userRole.icon;

  // Reusable User Info Component
  const UserInfoSection = () => {
    if (!userInfo) return null;
    
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg">
        <RoleIcon className={`w-4 h-4 ${userRole.color}`} />
        <div className="text-right">
          <div className="text-sm font-medium text-card-foreground">
            {userInfo.name || "User"}
          </div>
          <div className="text-xs text-muted-foreground">
            {userInfo.email}
          </div>
          <div className={`text-xs ${userRole.color} font-medium`}>
            {userRole.label}
          </div>
        </div>
      </div>
    );
  };

  // Reusable Action Buttons Component
  const ActionButtons = () => (
    <div className="flex items-center gap-2">
      {canShowManageButton && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onManageClick}
          className="text-muted-foreground hover:text-card-foreground"
          title="Manage Organizations"
        >
          <Settings className="w-4 h-4" />
        </Button>
      )}
      {showSignOutButton && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onSignOutClick}
          className="text-muted-foreground hover:text-card-foreground"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      )}
      {showBackButton && onBackClick && (
        <Button variant="ghost" size="sm" onClick={onBackClick}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Button>
      )}
    </div>
  );

  if (variant === "organization") {
    return (
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
                <Building2 className="w-7 h-7 text-primary" />
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
                  {organizationName || title}
                </h1>
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <UserInfoSection />
              <ActionButtons />
            </div>
          </motion.div>
        </div>
      </header>
    );
  }

  // Dashboard variant
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="CodeScale Logo"
                width={24}
                height={24}
                className="w-full h-full"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-card-foreground">{title}</h1>
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <UserInfoSection />
            <ActionButtons />
          </div>
        </div>
      </div>
    </header>
  );
}
