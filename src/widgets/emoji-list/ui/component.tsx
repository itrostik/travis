import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

import cx from "classnames";

import { Loading, useChatStore, useInter, useLocalStorage } from "../../../shared";
import { emojis, internal, native } from "../lib";

import styles from "./emoji-list.module.scss";
import { v4 as hash } from "uuid";

function RenderEmoji({ nativeEmoji, emoji }: { nativeEmoji: boolean; emoji: string }) {
  if (nativeEmoji) return <div className={styles.native}>{native(emoji)}</div>;
  return (
    <img src={internal(emoji)} alt={emoji} className={styles.internal} loading="lazy" />
  );
}

function VariantEmoji({
  variants,
  handleEmoji,
  nativeEmoji,
  left,
}: {
  variants?: string[];
  handleEmoji: (e: string) => void;
  nativeEmoji: boolean;
  left: boolean;
}) {
  if (!variants) return;
  return (
    <div
      className={cx(styles.variants, {
        [styles.left]: left,
      })}
    >
      {variants.map((e) => {
        return (
          <div
            key={hash()}
            className={styles.btn}
            onClick={(event) => {
              event.stopPropagation();
              handleEmoji(native(e));
            }}
          >
            <RenderEmoji nativeEmoji={nativeEmoji} emoji={e} />
          </div>
        );
      })}
    </div>
  );
}

type EmojiRender = {
  emoji: {
    u: string;
    v?: string[];
  } | null;
  name: number | null;
  hash: string;
  index: number;
};

function generate(): EmojiRender[] {
  const list: EmojiRender[] = [];
  let i = 0;
  for (let j = 0; j < emojis.length; j++) {
    list.push({
      name: j,
      emoji: null,
      hash: hash(),
      index: 0,
    });
    for (const e of emojis[j]) {
      list.push({
        name: null,
        emoji: e,
        hash: hash(),
        index: i,
      });
      i++;
    }
    i = 0;
  }
  console.log(list);
  return list;
}
export function EmojiList({ mobile }: { mobile?: boolean }) {
  const { statusSidebar, addEmoji } = useChatStore();
  const { ref, inView } = useInView({
    threshold: 1,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const { nativeEmoji } = useLocalStorage();
  const listed = generate();
  const { i18n } = useInter();
  const [renderIndex, setRenderIndex] = useState(200);
  useEffect(() => {
    if (inView) {
      setRenderIndex((prev) => prev + 200);
    }
  }, [inView]);
  useEffect(() => {
    if (statusSidebar !== "emoji") {
      setRenderIndex(200);
    }
  }, [statusSidebar]);

  const handleEmoji = (emoji: string) => addEmoji(emoji);

  if (statusSidebar !== "emoji") {
    return <Loading />;
  }

  return (
    <div className={styles.wrapper} ref={containerRef}>
      {listed.map((element, index) => {
        if (index > renderIndex) return "";
        if (element.emoji) {
          return (
            <button
              key={hash()}
              className={cx(styles.btn, {
                [styles.has]: !!element.emoji.v && !mobile,
              })}
              onClick={() => {
                if (element.emoji) handleEmoji(native(element.emoji.u));
              }}
            >
              <VariantEmoji
                handleEmoji={handleEmoji}
                nativeEmoji={nativeEmoji}
                variants={element.emoji.v}
                left={element.index % 9 >= 5}
              />
              <RenderEmoji nativeEmoji={nativeEmoji} emoji={element.emoji.u} />
            </button>
          );
        } else {
          return (
            <div key={element.hash} className={styles.top}>
              {i18n.emojis[element.name!]}
            </div>
          );
        }
      })}

      <div style={{ height: 20 }} ref={ref} />
    </div>
  );
}
