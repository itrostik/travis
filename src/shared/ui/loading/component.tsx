import cx from "classnames";

import { IconLogo } from "../..";

import styles from "./loading.module.scss";

import { Loader2 } from "lucide-react";

export function Loading() {
  return (
    <div className={styles.wrapper}>
      <IconLogo />
      <Loader2 size={20} className={styles.loader} />
    </div>
  );
}

export function MiniLoading({ className }: { className?: string }) {
  return <Loader2 size={20} className={cx(styles.loader, className)} />;
}
