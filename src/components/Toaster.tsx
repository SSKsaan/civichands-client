"use client";

import { Toaster as HotToaster } from "react-hot-toast";

export default function Toaster() {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "var(--color-base-100)",
          color: "var(--color-base-content)",
          border: "1px solid var(--color-base-300)",
          borderRadius: "0.75rem",
          padding: "1rem",
          boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        },
        success: {
          iconTheme: {
            primary: "var(--color-success)",
            secondary: "var(--color-success-content)",
          },
        },
        error: {
          iconTheme: {
            primary: "var(--color-error)",
            secondary: "var(--color-error-content)",
          },
        },
      }}
    />
  );
}