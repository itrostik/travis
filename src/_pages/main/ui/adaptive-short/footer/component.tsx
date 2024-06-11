import { IconLogo, soc, useChatStore, useShortStore } from "../../../../../shared";

import styles from "./footer.module.scss";

import { ArrowLeft, Bolt, Search } from "lucide-react";

export function Footer() {
  const { add, pop, last } = useShortStore();
  const { setChat } = useChatStore();
  return (
    <footer className={styles.footer}>
      <div className={soc(styles.overlay, styles.transform, last !== null)}>
        <IconLogo />
        <button
          className={soc(styles.btn, styles.active, last === "settings")}
          onClick={() => {
            setChat(null);
            add("settings");
          }}
        >
          <Bolt size={20} />
        </button>
        <button
          className={soc(styles.btn, styles.active, last === "search")}
          onClick={() => {
            setChat(null);
            add("search");
          }}
        >
          <Search size={20} />
        </button>
      </div>
      <button className={styles.btn} onClick={() => pop()}>
        <ArrowLeft size={20} />
      </button>
    </footer>
  );
}
