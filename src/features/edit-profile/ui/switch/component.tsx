import cx from "classnames";

import { i18nList, useInter } from "../../../../shared";

import styles from "./switch.module.scss";

export function Switch() {
  const { i18n, switchLang } = useInter();

  return (
    <div className={styles.lang}>
      {i18n.changeProfile.language}
      <div className={styles.block}>
        {i18nList.map((e) => {
          return (
            <div
              role="button"
              key={e.id}
              className={cx(styles.btn, {
                [styles.active]: e.id === i18n.id,
                [styles.inactive]: e.id !== i18n.id,
              })}
              onClick={() => switchLang(e.id)}
            >
              {e.name}
            </div>
          );
        })}
      </div>
    </div>
  );
}
