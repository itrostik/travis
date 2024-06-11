import { Doc } from "../../../../../convex/_generated/dataModel";
import { ChatType, useUser, useUserAvatar } from "../../../../entities";
import { EditProfile, EditProfileType, LanguageInfo } from "../../../../features";
import {
  Loading,
  soc,
  useChatStore,
  useInter,
  useShortStore,
  useUserStore,
} from "../../../../shared";
import { Chat, ChatInfo, ChatList, Search, Settings } from "../../../../widgets";

import styles from "./adaptive-short.module.scss";
import { Footer } from "./footer";

export function AdaptiveShort({
  chats,
  user,
}: {
  chats: ChatType[] | undefined;
  user: Doc<"user">;
}) {
  const { chat } = useChatStore();
  const { i18n } = useInter();
  const { setUser } = useUserStore();
  const { pop, stack } = useShortStore();
  const { edit, store: getUser } = useUser();
  const { add: addAvatar } = useUserAvatar();
  const onDone = async (p: EditProfileType) => {
    pop();
    pop();
    await edit({
      user_id: user._id,
      username: p.username,
      name: p.name,
      about: p.about,
      locales: user.locales,
    });

    if (user.avatar_url !== p.avatar) {
      await addAvatar({
        url: p.avatar,
        user_id: user._id,
      });
    }
    const updatedUser = await getUser({ email: user.email });
    setUser(updatedUser);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.list}>
          <ChatList chats={chats} user={user} />
        </div>
        <div
          className={soc(
            styles.block,
            styles.block__active,
            stack.includes("settings"),
          )}
        >
          <Settings mobile={true} />
        </div>
        <div
          className={soc(
            styles.block,
            styles.block__active,
            stack.includes("settings_profile"),
          )}
        >
          <div className={styles.edit}>
            <EditProfile done={onDone} title={i18n.changeProfile.change} />
          </div>
        </div>
        <div
          className={soc(
            styles.block,
            styles.block__active,
            stack.includes("settings_language"),
          )}
        >
          <LanguageInfo />
        </div>
        <div
          className={soc(styles.block, styles.block__active, stack.includes("chat"))}
        >
          {chat ? <Chat /> : <Loading />}
        </div>
        <div
          className={soc(
            styles.block,
            styles.block__active,
            stack.includes("chat_info"),
          )}
        >
          <ChatInfo />
        </div>
        <div
          className={soc(styles.block, styles.block__active, stack.includes("search"))}
        >
          <Search chats={chats || []} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
