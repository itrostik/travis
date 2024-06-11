"use client";

import { useState } from "react";

import { api } from "../../../../../convex/_generated/api";
import { TextEditor } from "../../../../features";
import {
  calculateSizeFile,
  FileIcon,
  soc,
  useChatStore,
  useInter,
  useUserStore,
} from "../../../../shared";

import styles from "./bottom-chat.module.scss";
import { useMutation } from "convex/react";
import { v4 as hash } from "uuid";

import { Paperclip, SendHorizontal, Smile, Trash, X } from "lucide-react";

export function BottomChat() {
  const [files, setFiles] = useState<{ file: File; h: string }[]>([]);
  const { user } = useUserStore();
  const { i18n } = useInter();
  const {
    chat,
    statusSidebar,
    setStatusSidebar,
    message,
    setMessage,
    addNewMessages,
    edit,
    setEdit,
    answer,
    setAnswer,
  } = useChatStore();
  const patch = useMutation(api.message.patch);

  const sendMessage = async () => {
    if (edit) {
      if (message.length > 0) {
        patch({
          message_id: edit,
          value: message,
        });
      }
      setEdit(null);
    } else {
      if (message.length > 0 || files.length > 0) {
        addNewMessages({
          chat: chat!._id,
          value: message,
          hash: hash(),
          date: new Date(),
          user_id: user!._id,
          chat_id: chat!.chat_id,
          files: files.map((e) => e.file),
          reply: answer,
        });
        setAnswer(null);
        setFiles([]);
        setMessage("");
      }
    }
  };
  return (
    <div
      className={styles.wrapper}
      onKeyPress={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          sendMessage();
        }
      }}
    >
      <div className={soc(styles.edit, styles.edit__active, !!edit)}>
        <button className={styles.edit__btn} onClick={() => setEdit(null)}>
          <X size={16} />
        </button>
        <div className={styles.edit__title}>{i18n.chat.edit}</div>
      </div>
      <div className={soc(styles.edit, styles.edit__active, !!answer)}>
        <button className={styles.edit__btn} onClick={() => setAnswer(null)}>
          <X size={16} />
        </button>
        <div className={styles.edit__name}>{answer?.user?.name}</div>
        <div className={styles.edit__value}>{answer?.value}</div>
      </div>
      <div className={soc(styles.files, styles.files__active, files.length > 0)}>
        {files.map((f, i) => {
          const size = calculateSizeFile(f.file.size);
          return (
            <div key={f.h} className={styles.file}>
              <FileIcon file={f.file} gray={false} />
              <div className={styles.info}>
                <div className={styles.name}>{f.file.name}</div>
                <div className={styles.size}>
                  {size.value + " " + i18n.sizes[size.type]}
                </div>
              </div>
              <button
                className={styles.delete}
                onClick={() => {
                  setFiles((prev) => {
                    const buffer = [...prev];
                    buffer.splice(i, 1);
                    return buffer;
                  });
                }}
              >
                <Trash size={16} />
              </button>
            </div>
          );
        })}
      </div>
      <div className={styles.left}>
        <button
          className={soc(styles.emoji, styles.emoji__active, statusSidebar === "emoji")}
          onClick={() => {
            if (statusSidebar !== "emoji") {
              setStatusSidebar("emoji");
            } else {
              setStatusSidebar(null);
            }
          }}
        >
          <Smile size={20} />
        </button>
        <label
          htmlFor="files"
          className={soc(styles.btn, styles.btn__disable, edit !== null)}
        >
          <Paperclip size={20} />
        </label>

        <input
          disabled={edit !== null}
          type="file"
          multiple
          id="files"
          className={styles.input}
          onChange={(e) =>
            setFiles((prev) => [
              ...prev,
              ...Array.from(e.target.files || []).map((e) => {
                return {
                  file: e,
                  h: hash(),
                };
              }),
            ])
          }
        />
      </div>
      <TextEditor />
      <button className={styles.send} onClick={sendMessage}>
        <SendHorizontal />
      </button>
    </div>
  );
}
