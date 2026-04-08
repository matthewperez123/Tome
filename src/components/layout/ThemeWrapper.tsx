"use client";

import { useEffect, useRef } from "react";
import { useAppStore } from "@/lib/store";

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const isDarkMode = useAppStore((s) => s.isDarkMode);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const prevMode = useRef(isDarkMode);

  useEffect(() => {
    if (prevMode.current !== isDarkMode && wrapperRef.current) {
      wrapperRef.current.classList.add("theme-transition");
      const t = setTimeout(
        () => wrapperRef.current?.classList.remove("theme-transition"),
        300
      );
      prevMode.current = isDarkMode;
      return () => clearTimeout(t);
    }
    prevMode.current = isDarkMode;
  }, [isDarkMode]);

  return (
    <div ref={wrapperRef} className={isDarkMode ? "dark" : ""}>
      {children}
    </div>
  );
}
