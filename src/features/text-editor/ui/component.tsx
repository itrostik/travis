"use client";

import { ChangeEvent, useEffect, useRef } from "react";

import { useChatStore, useInter } from "../../../shared";

import styles from "./text-editor.module.scss";

export function TextEditor() {
  const { i18n } = useInter();
  const { setMessage, message } = useChatStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "23px";
      if (textareaRef.current.scrollHeight < 300) {
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      } else {
        textareaRef.current.style.height = `300px`;
      }
    }
  }, [message]);

  const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  return (
    <div className={styles.wrapper}>
      <textarea
        ref={textareaRef}
        className={styles.textarea}
        value={message}
        placeholder={i18n.chat.placeholder}
        onChange={onChange}
      ></textarea>
    </div>
  );
}
