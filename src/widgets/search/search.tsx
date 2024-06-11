import { useState } from "react";

import { Doc, Id } from "../../../convex/_generated/dataModel";
import { ChatType, useDialog, useUser } from "../../entities";
import {
  MiniLoading,
  useChatStore,
  useFullStore,
  useInter,
  useShortStore,
  useUserStore,
} from "../../shared";

import styles from "./search.module.scss";

export function Search({ chats }: { chats: ChatType[] }) {
  const { user } = useUserStore();
  const { setChat } = useChatStore();
  const { add } = useShortStore();
  const { create } = useDialog();
  const [answer, setAnswer] = useState<Doc<"user">[]>([]);
  const { setLeft } = useFullStore();
  const [loading, setLoading] = useState(false);
  const { find } = useUser();
  const [value, setValue] = useState("");
  const { i18n } = useInter();
  async function findUsers(v: string) {
    setLoading((_) => true);
    const data = await find({ value: v });
    setAnswer(data);
    setLoading((_) => false);
  }

  async function createDialog(id: Id<"user">) {
    const curUserId = user!._id;
    for (const item of chats) {
      if (item.type === "dialog") {
        if (
          (item.chat.first_user_id === id && item.chat.second_user_id === curUserId) ||
          (item.chat.second_user_id === id && item.chat.first_user_id === curUserId)
        ) {
          setChat(item);
          setLeft(null);
          setLoading(false);
          setAnswer([]);
          setValue("");
          add("chat");
          return;
        }
      }
    }
    await create({
      first_user_id: curUserId,
      second_user_id: id,
    });
    setLeft(null);
    setLoading(false);
    setAnswer([]);
    setValue("");
    add("chat");
  }

  return (
    <div className={styles.wrapper}>
      <input
        type="text"
        className={styles.input}
        value={value}
        placeholder={i18n.search}
        onChange={(e) => {
          findUsers(e.target.value);
          setValue(e.target.value);
        }}
      />
      <div className={styles.list}>
        {loading ? (
          <MiniLoading />
        ) : (
          <>
            {answer.map((e) => {
              if (user!._id === e._id) return "";
              return (
                <div
                  key={e._id}
                  className={styles.user}
                  onClick={() => {
                    setLoading(true);
                    createDialog(e._id);
                  }}
                >
                  <img src={e.avatar_url} className={styles.avatar} />
                  <div className={styles.username}>{e.username}</div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
