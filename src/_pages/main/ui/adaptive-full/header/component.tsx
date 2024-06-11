import { IconLogo, soc, useFullStore } from "../../../../../shared";

import styles from "./header.module.scss";

import { ArrowLeft, Bolt, Search } from "lucide-react";

export function Header() {
  const { left, setLeft } = useFullStore();
  return (
    <header className={styles.header}>
      <div className={soc(styles.overlay, styles.transform, left !== null)}>
        <IconLogo />
        <button
          className={soc(styles.btn, styles.active, left === "settings")}
          onClick={() => setLeft("settings")}
        >
          <Bolt size={20} />
        </button>
        <button
          className={soc(styles.btn, styles.active, left === "search")}
          onClick={() => setLeft("search")}
        >
          <Search size={20} />
        </button>
      </div>
      <button className={styles.btn} onClick={() => setLeft(null)}>
        <ArrowLeft size={20} />
      </button>
    </header>
  );
}
