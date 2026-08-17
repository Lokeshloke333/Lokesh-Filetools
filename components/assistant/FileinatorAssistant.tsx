"use client";

import React, { useState, useEffect } from "react";
import { AssistantLauncher } from "./AssistantLauncher";
import { AssistantWindow } from "./AssistantWindow";

export function FileinatorAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Hydration safety and optional persistence
  useEffect(() => {
    setIsMounted(true);
    // Optionally we could check localStorage to auto-open if needed, 
    // but the prompt says to persist only if dismissed (optional).
    // For now, it stays closed by default.
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <AssistantLauncher isOpen={isOpen} onClick={() => setIsOpen(true)} />
      <AssistantWindow isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
