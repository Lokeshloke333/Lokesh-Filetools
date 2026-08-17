"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { AssistantLauncher } from "./AssistantLauncher";

const AssistantWindow = dynamic(() => import("./AssistantWindow").then(mod => mod.AssistantWindow), {
  ssr: false,
});

export function FileinatorAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Hydration safety and optional persistence
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setHasOpened(true);
    }
  }, [isOpen]);

  if (!isMounted) return null;

  return (
    <>
      <AssistantLauncher isOpen={isOpen} onClick={() => setIsOpen(true)} />
      {hasOpened && <AssistantWindow isOpen={isOpen} onClose={() => setIsOpen(false)} />}
    </>
  );
}
