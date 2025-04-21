"use client";
import { ReactNode, useEffect, useState } from "react";

export default function MobileBlocker({ children }: { children: ReactNode }) {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    }
    handleResize(); // Check on initial load
    // Check on resize
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (isMobile) {
    return (
      <div className="fixed inset-0 flex items-center justify-center p-4 bg-white">
        <div className="text-center max-w-full">
          <h1 className="text-xl font-bold mb-2">Mobile Version Not Available</h1>
          <p>Please use a desktop device to access this content.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
