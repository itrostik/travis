import { ReactNode } from "react";

import styles from "./skeleton.module.scss";

/*
  В него нужно передавать только div-элементы, другие не пойдут
  Пример можно увидеть в этой же папке - SkeletonChat.tsx
 */
export function Skeleton({ children }: { children: ReactNode }) {
  return <div className={styles.wrapper}>{children}</div>;
}

export function SkeletonChat() {
  return (
    <Skeleton>
      <article
        style={{
          width: "100%",
          height: 60,
          borderRadius: 10,
          display: "flex",
          padding: 10,
          gap: 10,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            flex: 1,
            height: 30,
            borderRadius: 10,
          }}
        />
      </article>
    </Skeleton>
  );
}

type SkeletonMessageType = {
  width: number;
  isGroup: boolean;
  isReply: boolean;
};

export function SkeletonMessage({ width, isGroup, isReply }: SkeletonMessageType) {
  return (
    <Skeleton>
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "flex-end",
        }}
      >
        {isGroup && (
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
            }}
          />
        )}
        <div
          style={{
            maxWidth: width,
            width: "100%",
            padding: "5px 5px 20px 5px",

            minHeight: 40,
            borderRadius: 5,
          }}
        >
          {isReply && (
            <div
              style={{
                width: "100%",
                height: 30,
                borderRadius: 5,
              }}
            />
          )}
        </div>
      </div>
    </Skeleton>
  );
}
