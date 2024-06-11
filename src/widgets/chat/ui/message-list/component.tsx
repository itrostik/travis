"use client";

import { api } from "../../../../../convex/_generated/api";
import { ChatType } from "../../../../entities";
import { useChatStore } from "../../../../shared";

import styles from "./message-list.module.scss";
import { Render } from "@/widgets/chat/ui/message-list/render";
import { usePaginatedQuery } from "convex/react";

export function MessageList({ chat }: { chat: ChatType }) {
  const { results, status, loadMore } = usePaginatedQuery(
    api.message.getAll,
    {
      chat_id: chat!.chat_id,
    },
    {
      initialNumItems: 52,
    },
  );
  const { newMessages } = useChatStore();

  if (status === "LoadingFirstPage") {
    return <div className={styles.empty} />;
  }

  return (
    <Render
      messages={results}
      newMessages={newMessages}
      loadMore={loadMore}
      status={status}
    />
  );
}
