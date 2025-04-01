"use client";
import { useEffect, useState } from "react";

const Loader = () => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <>
      {loading && (
        <div className="fixed left-0 top-0 z-999999 flex h-screen w-screen items-center justify-center bg-white">
          <div className="relative">
            {/* Outer ring */}
            <div className="h-20 w-20 animate-spin rounded-full border-8 border-solid border-emerald-200 border-t-emerald-500"></div>
            {/* Inner ring */}
            <div
              className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border-6 border-solid border-emerald-500 border-b-transparent"
              style={{
                animationDirection: "reverse",
                animationDuration: "0.8s",
              }}
            ></div>
            {/* Center dot */}
            <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default Loader;
