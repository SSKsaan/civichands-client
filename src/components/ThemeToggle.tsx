"use client";

import { useTheme } from "next-themes";
import { FiMoon, FiSun } from "react-icons/fi";

export default function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <div className="flex h-10 w-10 items-center justify-center">
      <button
        type="button"
        className="theme-toggle-to-dark btn btn-circle border border-base-300/70 bg-base-200/70 text-primary shadow-none transition-colors duration-200 hover:border-primary/50 hover:bg-base-300"
        aria-label="Switch to dark theme"
        onClick={() => setTheme("dark")}
      >
        <FiMoon aria-hidden="true" className="h-5 w-5" />
      </button>
      <button
        type="button"
        className="theme-toggle-to-light btn btn-circle border border-base-300/70 bg-base-200/70 text-accent shadow-none transition-colors duration-200 hover:border-accent/50 hover:bg-base-300"
        aria-label="Switch to light theme"
        onClick={() => setTheme("light")}
      >
        <FiSun aria-hidden="true" className="h-5 w-5" />
      </button>
    </div>
  );
}
