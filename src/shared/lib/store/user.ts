import { Doc } from "../../../../convex/_generated/dataModel";

import { create } from "zustand";

type Store = {
  user: Doc<"user"> | null;
  setUser: (user: Doc<"user"> | null) => void;
};

export const useUserStore = create<Store>()((set) => ({
  user: null,
  setUser: (user) => set(() => ({ user: user })),
}));
