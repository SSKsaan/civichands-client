"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { toast } from "react-hot-toast";

export default function SocialLoginToast() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const shownRef = useRef(false);

  useEffect(() => {
    const socialLogin = searchParams.get("social_login");
    if (socialLogin && !shownRef.current) {
      shownRef.current = true;
      if (!["/login", "/register"].includes(pathname)) {
        const provider = socialLogin === "github" ? "GitHub" : "Google";
        toast.success(`Signed in with ${provider}`);
      }
      window.history.replaceState({}, "", pathname);
    }
  }, [searchParams, pathname]);

  return null;
}