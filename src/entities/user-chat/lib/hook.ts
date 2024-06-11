import { api } from "../../../../convex/_generated/api";
import { Doc } from "../../../../convex/_generated/dataModel";

import { useMutation, useQuery } from "convex/react";

export function useUserChat(user: Doc<"user">) {
  const getChats = useQuery(api.user_chat.getChats, { user_id: user._id });

  return { getChats };
}

export function useUserChatPin() {
  const pin = useMutation(api.user_chat.pin);
  return { pin };
}
