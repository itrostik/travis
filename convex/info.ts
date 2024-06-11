import { ProfileInfoReturnType } from "../src/entities";

import { Doc, Id } from "./_generated/dataModel";
import { query } from "./_generated/server";
import { ConvexError, v } from "convex/values";

export const get = query({
  args: {
    doc: v.union(v.id("user"), v.id("saved")),
    type: v.union(v.literal("user"), v.literal("saved")),
  },
  handler: async (ctx, args): Promise<ProfileInfoReturnType> => {
    let document = await ctx.db.get(args.doc);
    if (!document) throw new ConvexError("Документ не найден");
    if (args.type !== "user") {
      document = document as Doc<"saved">;
      return {
        name: document.name,
        avatar_urls: [document.avatar_url],
        about: document.about,
      };
    } else {
      document = document as Doc<"user">;
      const avatars = await ctx.db
        .query("user_avatar")
        .withIndex("user_id", (q) => q.eq("user_id", args.doc as Id<"user">))
        .collect();
      const avatars_url = avatars
        .sort((a, b) => b._creationTime - a._creationTime)
        .map((avatar) => avatar.url);
      return {
        username: document.username,
        name: document.name,
        avatar_urls: avatars_url,
        about: document.about,
      };
    }
  },
});
