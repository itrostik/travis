import { api } from "../../../convex/_generated/api";

import { useMutation } from "convex/react";

export function useDialog() {
  const create = useMutation(api.dialog.create);

  return { create };
}
