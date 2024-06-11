import React from "react";

import { useInter } from "../../shared";

import styles from "./exit.module.scss";
import { signOut } from "next-auth/react";

import { LogOut } from "lucide-react";

export const Exit = () => {
  const { i18n } = useInter();

  return (
    <div className={styles.wrapper}>
      <div className={styles.content} onClick={() => signOut()}>
        <div className={styles.logout}>
          <LogOut size={20} />
        </div>
        <span className={styles.title}>{i18n.exit}</span>
      </div>
    </div>
  );
};
