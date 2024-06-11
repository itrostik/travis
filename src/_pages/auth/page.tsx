import { Dispatch, SetStateAction } from "react";

import { IconGithub, IconGoogle, IconLogo } from "../../shared";

import styles from "./auth.module.scss";
import { signIn } from "next-auth/react";

export function AuthPage({
  setLoading,
}: {
  setLoading: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className={styles.wrapper}>
      <IconLogo />
      <button
        className={styles.btn}
        onClick={async () => {
          setLoading(true);
          await signIn("google");
        }}
      >
        <IconGoogle />
      </button>
      <button
        className={styles.btn}
        onClick={async () => {
          setLoading(true);
          await signIn("github");
        }}
      >
        <IconGithub />
      </button>
    </div>
  );
}
