import { api } from "../../../../convex/_generated/api";

import { useMutation } from "convex/react";

export function useMessage() {
  const send = useMutation(api.message.send);

  return { send };
}
