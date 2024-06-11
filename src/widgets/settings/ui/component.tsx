import { Exit, ProfileInfo } from "../../../features";
import { useUserStore } from "../../../shared";

import { SettingsList } from "./settings-list";
import styles from "./settings.module.scss";

export function Settings({ mobile }: { mobile: boolean }) {
  const { user } = useUserStore();

  return (
    <div className={styles.wrapper}>
      <ProfileInfo doc={user!._id} type={"user"} />
      <div
        style={{
          flex: 1,
        }}
      >
        <SettingsList mobile={mobile} />
      </div>
      <Exit />
    </div>
  );
}
