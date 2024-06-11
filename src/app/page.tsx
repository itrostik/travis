"use client";

import { useEffect, useState } from "react";

import { AuthPage, MainPage, NewUserPage } from "../_pages";
import { useUser } from "../entities";
import { Loading, useInter, useUserStore } from "../shared";

import { useSession } from "next-auth/react";

export default function Home() {
  const { data } = useSession();
  const { store: getUser } = useUser();

  const { user, setUser } = useUserStore();
  const { switchLang } = useInter();
  const [loading, setLoading] = useState(true);

  const asyncGetUser = async () => {
    const user = await getUser({ email: data!.user!.email! });
    if (user) switchLang(user.locales);
    setUser(user);
    setLoading(false);
  };

  useEffect(() => {
    if (data === undefined) {
      setLoading(true);
    } else if (data === null) {
      setLoading(false);
    } else {
      asyncGetUser();
    }
  }, [data]);

  if (loading) {
    return <Loading />;
  }

  if (data === null) {
    return <AuthPage setLoading={setLoading} />;
  }

  if (user === null) {
    return <NewUserPage email={data.user!.email!} />;
  }

  if (user) {
    return <MainPage user={user} />;
  }
}
