import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface StoreType {
  nativeEmoji: boolean;
  changeNativeEmoji: () => void;
}
export const useLocalStorage = create<StoreType>()(
  persist(
    (set, get) => ({
      nativeEmoji: false,
      changeNativeEmoji: () => set({ nativeEmoji: !get().nativeEmoji }),
    }),
    {
      name: "travis-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
