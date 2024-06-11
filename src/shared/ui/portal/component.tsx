import { ReactNode } from "react";
import { createPortal } from "react-dom";

import styles from "./portal.module.scss";

export function Portal({
  close,
  children,
  title,
}: {
  close: () => void;
  children: ReactNode;
  title: string;
}) {
  return (
    <>
      {createPortal(
        <div className={styles.wrapper}>
          <div
            className={styles.overlay}
            onClick={(e) => {
              e.preventDefault();
              close();
            }}
          />

          <div className={styles.portal}>
            <h3 className={styles.title}>{title}</h3>
            {children}
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
