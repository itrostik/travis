import { ShortStackType } from "./types";
import { create } from "zustand";

interface StoreType {
  stack: ShortStackType[];
  last: ShortStackType;
  add: (b: ShortStackType) => void;
  pop: () => void;
}
export const useShortStore = create<StoreType>()((set, get) => ({
  stack: [null],
  last: null,
  add: (b) => {
    const buffer = [...get().stack];
    const l = get().last;
    if (l === "chat" && b !== "chat_info") {
      buffer.pop();
    }
    if (l === "chat_info" && b !== "chat_info") {
      buffer.pop();
      buffer.pop();
    }
    if (l === "settings" && b === "search") {
      buffer.pop();
    }
    if (l === "search" && b === "settings") {
      buffer.pop();
    }
    if (l === "search" && b === "chat") {
      buffer.pop();
    }
    set({
      stack: [...buffer, b],
      last: b,
    });
  },
  pop: () => {
    if (get().last === null) return;
    const buffer = [...get().stack];
    buffer.pop();
    if (buffer.length === 0) {
      set({ stack: [null], last: null });
      return;
    }
    set({ stack: buffer, last: buffer[buffer.length - 1] || null });
  },
}));
