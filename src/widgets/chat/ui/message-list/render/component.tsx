import { useEffect, useRef, useState } from "react";

import {
  BlockType,
  MessageItem,
  MessageItemSendingMemo,
  MessageType,
  NewMessageType,
} from "../../../../../entities";
import { MiniLoading } from "../../../../../shared";

import styles from "./render.module.scss";
import { v4 as hash } from "uuid";

import { ArrowBigDown } from "lucide-react";

const MAX_HEIGHT = 10 ** 10;

/**
 * Генерация даты
 */
function generateDate(v: number): string {
  return new Date(v).toLocaleDateString("RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Генерация блоков, блоки - это то, что рендерится
 * Туда входит и дата, и сообщения, и неотправленное сообщение
 */
function generateBlocks(messages: MessageType[], blocks: BlockType[]): BlockType[] {
  if (messages.length === 0) return [];
  blocks = blocks.filter((i) => i.type === "sending").sort((a, b) => a.date - b.date);
  messages = messages.sort((a, b) => a._creationTime - b._creationTime);
  let union: string[] = [];
  const uniqueHash: Set<string> = new Set();
  for (const b of blocks) {
    if (!uniqueHash.has(b.hash)) {
      union.push(b.hash);
      uniqueHash.add(b.hash);
    }
  }
  for (const b of messages) {
    if (!uniqueHash.has(b.hash)) {
      union.push(b.hash);
      uniqueHash.add(b.hash);
    }
  }
  const res: BlockType[] = [];
  for (const hash of union) {
    const message = messages.find((e) => e.hash === hash);
    const sending = blocks.find((e) => e.hash === hash);
    if (message) {
      res.push({
        type: "initial",
        date: message._creationTime,
        hash: message.hash,
        m: message,
      });
    } else if (sending) {
      res.push(sending);
    } else {
      throw new Error("52");
    }
  }
  return res.sort((a, b) => a.date - b.date);
}

function Dates(m: BlockType[]): BlockType[] {
  m = m.filter((e) => e.type !== "date");
  if (m.length === 0) return [];
  let cur = generateDate(m[0].date);
  const ans: BlockType[] = [];
  ans.push({
    type: "date",
    d: cur,
    hash: hash(),
    date: m[0].date,
  });
  for (const b of m) {
    let d = generateDate(b.date);
    if (d !== cur) {
      cur = d;
      ans.push({
        type: "date",
        d: cur,
        hash: hash(),
        date: b.date,
      });
    }
    ans.push(b);
  }
  return ans;
}

export function Render({
  messages,
  newMessages,
  loadMore,
  status,
}: {
  messages: MessageType[];
  newMessages: NewMessageType[];
  loadMore: (numItems: number) => void;
  status: "LoadingFirstPage" | "CanLoadMore" | "LoadingMore" | "Exhausted";
}) {
  const [blocks, setBlocks] = useState<BlockType[]>([]);
  const [firstRender, setFirstRender] = useState(false);
  const [lastHeight, setLastHeight] = useState(0);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  function scroll(value: number) {
    if (!containerRef.current) return;
    containerRef.current.scrollTop = value;
  }

  useEffect(() => {
    console.log("%c Первый рендер сообщений", "color: orange");
    if (blocks.length === 0) {
      setBlocks(Dates(generateBlocks(messages, blocks)));
      setFirstRender(true);
      setTimeout(() => scroll(MAX_HEIGHT), 20);
    }
  }, []);

  useEffect(() => {
    console.log("%c Рендер отправляющихся сообщений", "color: orange");
    const m = newMessages[newMessages.length - 1];
    if (m) {
      setBlocks((prev) => {
        return Dates([
          ...prev,
          {
            type: "sending",
            hash: m.hash,
            value: m.value,
            date: m.date.getTime(),
            chat: m.chat_id,
            user: m.user_id,
            files: m.files,
            reply: m.reply,
          },
        ]);
      });
      setTimeout(() => scroll(MAX_HEIGHT), 10);
    }
  }, [newMessages]);

  useEffect(() => {
    console.log("%c Рендер пришедших сообщений", "color: orange");
    const container = containerRef.current;
    if (firstRender && container) {
      setBlocks(Dates(generateBlocks(messages, blocks)));
    }
    console.log("%c Скролл, когда пришли сверху новые сообщения", "color: orange");
    if (lastHeight && container && container.scrollTop === 0) {
      setTimeout(() => {
        scroll(container.scrollHeight - lastHeight);
      }, 100);
    }
  }, [messages]);

  function onScroll() {
    const container = containerRef.current;
    if (container && container.scrollTop === 0) {
      const { scrollHeight } = container;
      setLastHeight(scrollHeight);
      loadMore(52);
    }
    if (container && container.scrollHeight - container.scrollTop > 1000) {
      setShowScrollButton(true);
    } else {
      setShowScrollButton(false);
    }
  }
  return (
    <>
      <div className={styles.list} ref={containerRef} onScroll={() => onScroll()}>
        {status !== "Exhausted" && (
          <div className={styles.loading}>
            <MiniLoading />
          </div>
        )}

        {blocks.map((b) => {
          if (b.type === "date") {
            return (
              <div key={b.hash} className={styles.block}>
                <div className={styles.date}>{b.d}</div>
              </div>
            );
          }

          if (b.type === "sending") {
            return <MessageItemSendingMemo key={b.hash} message={b} />;
          }

          return <MessageItem key={b.hash} message={b.m} />;
        })}
      </div>
      {showScrollButton && (
        <button className={styles.down} onClick={() => scroll(MAX_HEIGHT)}>
          <ArrowBigDown size={20} />
        </button>
      )}
    </>
  );
}
