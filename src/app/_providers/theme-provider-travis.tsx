"use client";

import { ReactNode } from "react";

import { ThemeProvider } from "next-themes";

export function ThemeProviderTravis({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      storageKey="travis-component"
      defaultTheme="system"
      enableSystem
      attribute="data-theme"
    >
      {children}
    </ThemeProvider>
  );
}
