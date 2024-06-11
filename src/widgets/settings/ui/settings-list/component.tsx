import cx from "classnames";

import {
  useChatStore,
  useInter,
  useFullStore,
  useShortStore,
} from "../../../../shared";

import styles from "./settings-list.module.scss";
import { useTheme } from "next-themes";

import { ChevronRight, Languages, SunMoon, UserRound } from "lucide-react";

export function SettingsList({ mobile }: { mobile: boolean }) {
  const { setChat } = useChatStore();

  const { right, setRight } = useFullStore();
  const { add, stack } = useShortStore();
  const { i18n } = useInter();
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <div className={styles.wrapper}>
      <button
        className={cx(styles.item, {
          [styles.active]: !mobile && right === "profile",
          [styles.active]: mobile && stack.includes("settings_profile"),
        })}
        onClick={() => {
          setChat(null);
          add("settings_profile");
          setRight("profile");
        }}
      >
        <UserRound size={20} className={cx(styles.lucide, styles.profile)} />
        <span className={styles.title}>{i18n.settings.profile}</span>
        <ChevronRight size={20} className={styles.arrow} />
      </button>
      <button
        className={cx(styles.item, {
          [styles.active]: !mobile && right === "language",
          [styles.active]: mobile && stack.includes("settings_language"),
        })}
        onClick={() => {
          setChat(null);
          add("settings_language");
          setRight("language");
        }}
      >
        <Languages size={20} className={cx(styles.lucide, styles.language)} />
        <span className={styles.title}>{i18n.settings.language}</span>
        <ChevronRight size={20} className={styles.arrow} />
      </button>
      <div className={styles.block}>
        <SunMoon size={20} className={cx(styles.lucide, styles.theme)} />
        <span className={styles.title}>{i18n.settings.theme}</span>
        <div
          className={styles.switch}
          onClick={() => {
            if (resolvedTheme === "dark") setTheme("light");
            else setTheme("dark");
          }}
        >
          <div
            className={cx(styles.circle, {
              [styles.selected]: resolvedTheme === "dark",
            })}
          ></div>
        </div>
      </div>
    </div>
  );
}
