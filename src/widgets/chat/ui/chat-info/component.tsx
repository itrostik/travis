import { ProfileInfo } from "../../../../features";
import { useChatStore } from "../../../../shared";

import styles from "./chat-info.module.scss";
import { PinnedMessages } from "@/features/pinned-messages";

export function ChatInfo() {
  const { chat } = useChatStore();

  if (!chat) {
    return "";
  }
  return (
    <div className={styles.wrapper}>
      <ProfileInfo
        doc={chat.type === "dialog" ? chat.chat.user._id : chat.chat._id}
        type={chat.type === "dialog" ? "user" : chat.type}
      />
      <PinnedMessages chat_id={chat.chat_id} />
    </div>
  );
}
