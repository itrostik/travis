import { soc, useChatStore, useLocalStorage } from "../../../../../shared";

import styles from "./sidebar-top.module.scss";

import { X } from "lucide-react";

export function SidebarTop({ emoji }: { emoji?: boolean }) {
  const { setStatusSidebar } = useChatStore();
  const { nativeEmoji, changeNativeEmoji } = useLocalStorage();
  return (
    <div className={styles.top}>
      <button className={styles.btn} onClick={() => setStatusSidebar(null)}>
        <X size={20} />
      </button>
      {emoji && (
        <div className={styles.native}>
          <div className={styles.text}>Нативные эмодзи</div>
          <div className={styles.switch} onClick={() => changeNativeEmoji()}>
            <div className={soc(styles.circle, styles.active, nativeEmoji)} />
          </div>
        </div>
      )}
    </div>
  );
}
