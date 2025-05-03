"use client";

import React, { useEffect, useState } from "react";
import MonoConnect from "@mono.co/connect.js";
import { Button } from "../ui/button";

interface MonoConnectButtonProps {
  onSuccess: (data: { code: string }) => void;
  text?: string;
  className?: string;
  disabled?: boolean;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
}

export default function MonoConnectButton({
  onSuccess,
  text = "Link Your Bank Account",
  className = "",
  disabled = false,
  variant = "default",
}: MonoConnectButtonProps) {
  const [monoInstance, setMonoInstance] = useState<any>(null);

  useEffect(() => {
    // Initialize Mono Connect
    const monoConnect = new MonoConnect({
      key: process.env.NEXT_PUBLIC_MONO_PUBLIC_KEY || "",
      onClose: () => console.log("Widget closed"),
      onLoad: () => console.log("Widget loaded successfully"),
      onSuccess,
    });

    setMonoInstance(monoConnect);

    return () => {
      // Clean up mono instance if needed
    };
  }, [onSuccess]);

  const handleConnectClick = () => {
    if (monoInstance) {
      monoInstance.open();
    }
  };

  return (
    <Button
      onClick={handleConnectClick}
      className={className}
      disabled={disabled || !monoInstance}
      variant={variant}
    >
      {text}
    </Button>
  );
}
