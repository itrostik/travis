"use client";

import { ReactNode, useState } from "react";

import { InternationalizationContext } from "../../shared";

export function InternationalizationProvider({ children }: { children: ReactNode }) {
  const [id, setId] = useState(0);

  return (
    <InternationalizationContext.Provider
      value={{
        id,
        setId,
      }}
    >
      {children}
    </InternationalizationContext.Provider>
  );
}
