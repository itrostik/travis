import { ChatType } from "../../../../entities";
import { useChatStore, useShortStore } from "../../../../shared";

import styles from "./header-chat.module.scss";
import Image from "next/image";

export function HeaderChat({ chat }: { chat: ChatType }) {
  const { setStatusSidebar } = useChatStore();
  const { add } = useShortStore();
  return (
    <div
      className={styles.wrapper}
      onClick={() => {
        setStatusSidebar("info");
        add("chat_info");
      }}
    >
      <div className={styles.info}>
        <Image
          src={
            chat.type !== "dialog" ? chat.chat.avatar_url : chat.chat.user.avatar_url
          }
          alt={"avatar"}
          width={30}
          height={30}
          className={styles.image}
        />
        <span className={styles.name}>
          {chat.type !== "dialog" ? chat.chat.name : chat.chat.user.name}
        </span>
      </div>
    </div>
  );
}
