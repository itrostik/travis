import { CSSProperties } from "react";
import { createPortal } from "react-dom";

import { api } from "../../../convex/_generated/api";
import { useChatStore, useInter } from "../../shared";

import styles from "./popup.module.scss";
import { usePopupStore } from "@/shared/lib/store/popup";
import { useMutation } from "convex/react";

import { Pencil, Pin, PinOff, Reply, Trash } from "lucide-react";

export function Popup() {
  const { deed, setDeed } = usePopupStore();
  const { setEdit, setAnswer } = useChatStore();
  const { i18n } = useInter();
  const pinChat = useMutation(api.user_chat.pin);
  const pinMessage = useMutation(api.message.pin);
  const deleteMessage = useMutation(api.message.deleteMessage);
  const getStyle = () => {
    const style: CSSProperties = {};
    if (deed) {
      const { x, y, width, height } = deed;
      if (x < width / 2) {
        style.left = x;
      } else {
        style.right = width - x;
      }
      if (y < height / 2) {
        style.top = y;
      } else {
        style.bottom = height - y;
      }
    }
    return style;
  };

  return createPortal(
    <>
      {deed && (
        <div
          className={styles.wrapper}
          onContextMenu={(e) => {
            e.preventDefault();
            setDeed(null);
          }}
        >
          <div className={styles.overlay} onClick={() => setDeed(null)} />
          <div className={styles.block} style={getStyle()}>
            {deed.type === "chat" && (
              <>
                <button
                  className={styles.btn}
                  onClick={() => {
                    if (deed && deed.chat_id) {
                      pinChat({
                        chat_id: deed.chat_id,
                        pinned: !deed.pinned,
                      });
                    }
                    setDeed(null);
                  }}
                >
                  {deed.pinned ? (
                    <>
                      <PinOff size={16} />
                      <div className={styles.text}>{i18n.popup.pinned}</div>
                    </>
                  ) : (
                    <>
                      <Pin size={16} />
                      <div className={styles.text}>{i18n.popup.unpinned}</div>
                    </>
                  )}
                </button>
              </>
            )}
            {deed.type === "message" && (
              <>
                <button
                  className={styles.btn}
                  onClick={() => {
                    if (deed && deed.message_id) {
                      pinMessage({
                        message_id: deed.message_id,
                        pinned: !deed.pinned,
                      });
                    }
                    setDeed(null);
                  }}
                >
                  {deed.pinned ? (
                    <>
                      <PinOff size={16} />
                      <div className={styles.text}>{i18n.popup.pinned}</div>
                    </>
                  ) : (
                    <>
                      <Pin size={16} />
                      <div className={styles.text}>{i18n.popup.unpinned}</div>
                    </>
                  )}
                </button>
                <button
                  className={styles.btn}
                  onClick={() => {
                    if (deed && deed.message_id) {
                      deleteMessage({ message_id: deed.message_id });
                    }
                    setDeed(null);
                  }}
                >
                  <Trash size={16} />
                  <div className={styles.text}>{i18n.popup.delete}</div>
                </button>
                <button
                  className={styles.btn}
                  onClick={() => {
                    if (deed && deed.message_id && deed.message) {
                      setEdit({
                        id: deed.message_id,
                        message: deed.message,
                      });
                    }
                    setDeed(null);
                  }}
                >
                  <Pencil size={16} />
                  <div className={styles.text}>{i18n.popup.edit}</div>
                </button>
                <button
                  className={styles.btn}
                  onClick={() => {
                    if (deed && deed.message_item) {
                      setAnswer(deed.message_item);
                    }
                    setDeed(null);
                  }}
                >
                  <Reply size={16} />
                  <div className={styles.text}>{i18n.popup.reply}</div>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>,
    document.body,
  );
}
