import { useContext } from "react";

import { i18nList } from "../..";

import { InternationalizationContext } from "./context";

export function useInter() {
  const { id, setId } = useContext(InternationalizationContext);

  const nextLang = () => {
    setId((id + 1) % i18nList.length);
  };

  return { i18n: i18nList[id], switchLang: setId, nextLang: nextLang };
}
