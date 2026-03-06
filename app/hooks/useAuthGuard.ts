"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/state/auth";

export function useAuthGuard() {
  const { isAuthed } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthed) {
      router.replace(`/login?from=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthed, router, pathname]);

  return isAuthed;
}
