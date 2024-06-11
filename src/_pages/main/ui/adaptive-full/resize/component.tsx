import { RefObject } from "react";

import { useResize } from "../../../..";

import styles from "./resize.module.scss";

export function Resize({ leftRef }: { leftRef: RefObject<HTMLDivElement> }) {
  const { initResize, resetSize } = useResize(leftRef, 500, 200, 300);
  return (
    <div
      className={styles.resize}
      onDoubleClick={resetSize}
      onMouseDown={(event) => {
        initResize(event);
      }}
    />
  );
}
