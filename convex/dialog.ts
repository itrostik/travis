import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    first_user_id: v.id("user"),
    second_user_id: v.id("user"),
  },
  handler: async (ctx, args) => {
    const dialog_id = await ctx.db.insert("dialog", {
      first_user_id: args.first_user_id,
      second_user_id: args.second_user_id,
    });

    await ctx.db.insert("user_chat", {
      user_id: args.first_user_id,
      chat_id: dialog_id,
      pinned: false,
      type: "dialog",
    });

    await ctx.db.insert("user_chat", {
      user_id: args.second_user_id,
      chat_id: dialog_id,
      pinned: false,
      type: "dialog",
    });
  },
});
