import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const add = mutation({
  args: { url: v.string(), user_id: v.id("user") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.user_id, {
      avatar_url: args.url,
    });
    return await ctx.db.insert("user_avatar", {
      url: args.url,
      user_id: args.user_id,
    });
  },
});
