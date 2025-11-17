"use client";

import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authSelector } from "@/lib/slices/auth-slice";
import { organizationSelector } from "@/lib/slices/organization-slice";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const authState = useSelector(authSelector);
  const organizationState = useSelector(organizationSelector);

  const isAdmin = organizationState.organizationAdmin._id === authState._id;
  const isModerator = organizationState.moderators.some(
    (moderator) => moderator._id === authState._id
  );

  useEffect(() => {
    if (!isAdmin && !isModerator) {
      router.replace("/dashboard");
    }
  }, [isAdmin, isModerator]);

  if (!isAdmin && !isModerator) return null;

  return <>{children}</>;
}
