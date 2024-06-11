import { Doc } from "../../../convex/_generated/dataModel";
import { ChatListItem, ChatType } from "../../entities";
import { SkeletonChat } from "../../shared";

import styles from "./chat-list.module.scss";

export function ChatList({
  chats,
  user,
}: {
  chats: ChatType[] | undefined;
  user: Doc<"user">;
}) {
  if (chats === undefined) {
    return (
      <div className={styles.wrapper}>
        {Array.from({ length: 30 }, (_, i) => (
          <SkeletonChat key={i} />
        ))}
      </div>
    );
  }
  return (
    <div className={styles.wrapper}>
      {chats.map((e) => {
        return <ChatListItem key={e._id} current={e} user={user} />;
      })}
    </div>
  );
}
