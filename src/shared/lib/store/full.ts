import { FullLeftType, FullRightType } from "@/shared/lib/store/types";
import { create } from "zustand";

interface StoreType {
  left: FullLeftType;
  setLeft: (l: FullLeftType) => void;
  right: FullRightType;
  setRight: (r: FullRightType) => void;
}

export const useFullStore = create<StoreType>()((set) => ({
  left: null,
  right: null,
  setLeft: (l) => set({ left: l }),
  setRight: (r) => set({ right: r }),
}));
