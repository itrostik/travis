import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const createFile = mutation({
  args: { storageId: v.id("_storage"), name: v.string(), size: v.number() },
  handler: async (ctx, args) => {
    const url = await ctx.storage.getUrl(args.storageId);
    if (url === null) return null;
    const id = await ctx.db.insert("file", {
      storage: args.storageId,
      name: args.name,
      size: args.size,
      url,
    });
    return await ctx.db.get(id);
  },
});
