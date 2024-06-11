import React from "react";

import { useChatStore } from "../../../shared";

import { BottomChat } from "./bottom-chat";
import styles from "./chat.module.scss";
import { HeaderChat } from "./header-chat";
import { MessageList } from "@/widgets/chat/ui/message-list";

export function Chat() {
  const { chat } = useChatStore();
  //
  return (
    <div className={styles.wrapper}>
      <HeaderChat chat={chat!} />
      <div className={styles.main}>
        <div className={styles.center}>
          <MessageList chat={chat!} />
          <BottomChat />
        </div>
      </div>
    </div>
  );
}
