import { api } from "../../../convex/_generated/api";

import { useMutation, useQuery } from "convex/react";

export function useUser() {
  const store = useMutation(api.user.store);
  const create = useMutation(api.user.create);
  const checkUsername = useMutation(api.user.checkUsername);
  const devGetAll = useQuery(api.user.devGetAll);
  const edit = useMutation(api.user.edit);
  const switchLang = useMutation(api.user.switchLang);
  const find = useMutation(api.user.find);

  return { store, create, checkUsername, devGetAll, edit, switchLang, find };
}
