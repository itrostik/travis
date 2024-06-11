import { api } from "../../../../convex/_generated/api";

import { ProfileInfoParamsType, ProfileInfoReturnType } from "./types";
import { useQuery } from "convex/react";

export function useProfileInfo({
  doc,
  type,
}: ProfileInfoParamsType): ProfileInfoReturnType | undefined {
  return useQuery(api.info.get, {
    doc,
    type,
  });
}
