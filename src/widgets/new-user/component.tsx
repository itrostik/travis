import { useState } from "react";

import { useUser, useUserAvatar } from "../../entities";
import { EditProfile, EditProfileType } from "../../features";
import { Loading, useInter, useUserStore } from "../../shared";

import styles from "./new-user.module.scss";

export function NewUser({ email }: { email: string }) {
  const { i18n } = useInter();
  const [loading, setLoading] = useState(false);

  const { create: createUser, store: getUser } = useUser();
  const { add: addAvatar } = useUserAvatar();

  const { setUser } = useUserStore();
  const onDone = async (p: EditProfileType) => {
    setLoading(true);
    const user_id = await createUser({
      username: p.username,
      email,
      name: p.name,
      about: p.about,
      locales: i18n.id,
    });

    await addAvatar({
      url: p.avatar,
      user_id,
    });
    const user = await getUser({ email });
    setUser(user);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={styles.wrapper}>
      <EditProfile done={onDone} title={i18n.changeProfile.create} />
    </div>
  );
}
