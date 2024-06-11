import { Doc } from "../../../../convex/_generated/dataModel";
import { useUserChat } from "../../../entities";

import { AdaptiveFull } from "./adaptive-full";
import { AdaptiveShort } from "@/_pages/main/ui/adaptive-short";

export function MainPage({ user }: { user: Doc<"user"> }) {
  const { getChats: chats } = useUserChat(user);

  return (
    <>
      {navigator.maxTouchPoints > 0 ? (
        <AdaptiveShort chats={chats} user={user} />
      ) : (
        <AdaptiveFull chats={chats} user={user} />
      )}
    </>
  );
}
