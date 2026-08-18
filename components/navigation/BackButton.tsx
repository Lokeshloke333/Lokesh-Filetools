"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  className?: string;
}

export function BackButton({ className }: BackButtonProps) {
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    // If the history length is greater than 2, it's very likely we came from within the site
    // or we navigated from somewhere else. If it's exactly 1 or 2, we might be a fresh landing page.
    setCanGoBack(window.history.length > 2);
  }, []);

  const handleBack = () => {
    if (canGoBack) {
      router.back();
    } else {
      router.push("/alltools");
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleBack}
      className={cn(
        "w-10 h-10 rounded-full border-slate-200 text-slate-500 hover:text-slate-800 transition-colors",
        className
      )}
      aria-label="Go back"
    >
      <ChevronLeft className="w-5 h-5" />
    </Button>
  );
}

