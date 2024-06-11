import { createContext } from "react";

import { InternationalizationContextType } from "./types";

export const InternationalizationContext =
  createContext<InternationalizationContextType>({
    id: 0,
    setId: (_) => {},
  });
