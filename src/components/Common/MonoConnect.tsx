"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { MonoConnect } from "@mono.co/connect.js";

// Define prop types for our component
interface MonoConnectWidgetProps {
  onSuccess: (data: { code: string }) => void;
  onClose?: () => void;
  buttonText?: string;
  buttonClassName?: string;
  isReauthorizing?: boolean;
  reAuthAccountId?: string;
  customLoadingState?: React.ReactNode;
}

/**
 * MonoConnectWidget Component
 *
 * A React wrapper around the Mono Connect widget for bank account linking
 */
export default function MonoConnectWidget({
  onSuccess,
  onClose,
  buttonText = "Link your account",
  buttonClassName = "",
  isReauthorizing = false,
  reAuthAccountId,
  customLoadingState,
}: MonoConnectWidgetProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [monoInstance, setMonoInstance] = useState<any>(null);
  const router = useRouter();

  // Default button style if no custom class is provided
  const defaultButtonClass =
    "inline-flex items-center justify-center rounded-md bg-primary-500 py-3 px-6 text-center font-medium text-white hover:bg-primary-600 transition duration-200 lg:px-8";

  // Combined button classes
  const buttonClasses = buttonClassName ? buttonClassName : defaultButtonClass;

  useEffect(() => {
    // Initialize Mono Connect
    const mono = new MonoConnect({
      key: process.env.NEXT_PUBLIC_MONO_PUBLIC_KEY as string,
      onClose: () => {
        if (onClose) onClose();
      },
      onSuccess: (data) => {
        if (onSuccess) onSuccess(data);
      },
      reference: `user_${Date.now()}`, // You might want to use a more stable reference
    });

    setMonoInstance(mono);
    setIsLoading(false);

    // Clean up when component unmounts
    return () => {
      if (mono && typeof mono.close === "function") {
        mono.close();
      }
    };
  }, [onClose, onSuccess]);

  // Launch the Mono Connect Widget
  const openMonoWidget = async () => {
    if (monoInstance) {
      if (isReauthorizing && reAuthAccountId) {
        try {
          // Make API call to get reauth token
          const response = await fetch(
            `/api/v1/accounts/${reAuthAccountId}/reauthorize`,
            {
              method: "POST",
            }
          );
          const data = await response.json();

          if (data.token) {
            monoInstance.reauthorise(data.token);
          } else {
            console.error("Failed to get reauth token");
          }
        } catch (error) {
          console.error("Error reauthorizing account:", error);
        }
      } else {
        monoInstance.open();
      }
    }
  };

  // Show custom loading state or null while loading
  if (isLoading) {
    return customLoadingState || null;
  }

  // Render the connect button
  return (
    <button onClick={openMonoWidget} className={buttonClasses} type="button">
      {buttonText}
    </button>
  );
}
