import { api } from "../../../convex/_generated/api";

import { useMutation } from "convex/react";

export function useUserAvatar() {
  const add = useMutation(api.user_avatar.add);

  return { add };
}
