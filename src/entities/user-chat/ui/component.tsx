import cx from "classnames";

import { ChatType } from "../..";
import { Doc } from "../../../../convex/_generated/dataModel";
import { useInter, useShortStore, useChatStore } from "../../../shared";
import { reformatDateChats } from "../lib";

import styles from "./user-chat.module.scss";
import { usePopupStore } from "@/shared/lib/store/popup";
import Image from "next/image";

import { Bookmark, Check, CheckCheck, Pin } from "lucide-react";

export function ChatListItem({
  current,
  user,
}: {
  current: ChatType;
  user: Doc<"user">;
}) {
  const { i18n } = useInter();
  const { add } = useShortStore();
  const { setChat, chat, clearNewMessages, setEdit } = useChatStore();
  const { setDeed } = usePopupStore();
  return (
    <div
      className={cx(styles.item, { [styles.active]: chat?._id === current._id })}
      onClick={(e) => {
        add("chat");
        setChat(current);
        clearNewMessages();
        setEdit(null);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        setDeed({
          type: "chat",
          x: e.pageX,
          y: e.pageY,
          chat_id: current._id,
          pinned: current.pinned,
          // @ts-ignore
          width: e.view.innerWidth,
          // @ts-ignore
          height: e.view.innerHeight,
        });
      }}
    >
      <Image
        src={
          current.type === "dialog"
            ? current.chat.user.avatar_url
            : current.chat.avatar_url
        }
        alt="avatar"
        width={40}
        height={40}
        className={styles.avatar}
      />

      <div className={styles.right}>
        <div className={styles.top}>
          {current.type === "saved" && <Bookmark size={12} />}
          <h3 className={styles.title}>
            {current.type === "dialog" ? current.chat.user.name : current.chat.name}
          </h3>
          <div className={styles.info}>
            {current.pinned && <Pin size={12} />}
            {current.chat.last_message &&
              current.chat.last_message.user_id === user._id &&
              (current.chat.last_message.read ? (
                <CheckCheck size={12} />
              ) : (
                <Check size={12} />
              ))}
            {current.chat.last_message && (
              <div className={styles.date}>
                {reformatDateChats(current.chat.last_message._creationTime, i18n.slug)}
              </div>
            )}
          </div>
        </div>
        <div className={styles.bottom}>
          <div className={styles.message}>
            {current.chat.last_message === null
              ? "История очищена"
              : current.chat.last_message.value === ""
                ? "Файлы"
                : current.chat.last_message.value}
          </div>
          {current.unread > 0 && <div className={styles.unread}>{current.unread}</div>}
        </div>
      </div>
    </div>
  );
}
