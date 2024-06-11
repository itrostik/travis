import { Id } from "../../../../convex/_generated/dataModel";
import { ChatType, MessageType, NewMessageType } from "../../../entities";

import { create } from "zustand";

type statusSidebarType = "info" | "emoji" | null;

interface StoreType {
  chat: ChatType | null;
  setChat: (b: ChatType | null) => void;
  message: string;
  setMessage: (value: string) => void;
  statusSidebar: statusSidebarType;
  setStatusSidebar: (s: statusSidebarType) => void;
  addEmoji: (e: string) => void;
  newMessages: NewMessageType[];
  addNewMessages: (m: NewMessageType) => void;
  clearNewMessages: () => void;
  edit: Id<"message"> | null;
  setEdit: (o: { id: Id<"message">; message: string } | null) => void;
  answer: MessageType | null;
  setAnswer: (m: MessageType | null) => void;
}

export const useChatStore = create<StoreType>()((setState, get) => ({
  chat: null,
  setChat: (b) => setState({ chat: b, edit: null, message: "" }),
  message: "",
  setMessage: (value) => setState(() => ({ message: value })),
  statusSidebar: null,
  setStatusSidebar: (s) => setState({ statusSidebar: s }),
  addEmoji: (e) => setState({ message: get().message + e }),
  newMessages: [],
  addNewMessages: (m) => setState({ newMessages: [...get().newMessages, m] }),
  clearNewMessages: () => setState({ newMessages: [] }),
  edit: null,
  setEdit: (o) => {
    if (o === null) {
      setState({
        edit: null,
        message: "",
        answer: null,
      });
    } else {
      setState({
        edit: o.id,
        message: o.message,
        answer: null,
      });
    }
  },
  answer: null,
  setAnswer: (m) => {
    setState({
      edit: null,
      answer: m,
    });
  },
}));
