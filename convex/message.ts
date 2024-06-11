import { Doc, Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";

export const pin = mutation({
  args: {
    pinned: v.boolean(),
    message_id: v.id("message"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.message_id, {
      pinned: args.pinned,
    });
  },
});

export const patch = mutation({
  args: {
    value: v.string(),
    message_id: v.id("message"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.message_id, {
      value: args.value,
      edited: true,
    });
  },
});

export const deleteMessage = mutation({
  args: {
    message_id: v.id("message"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.message_id);
  },
});

export const send = mutation({
  args: {
    user_id: v.id("user"),
    chat_id: v.union(v.id("dialog"), v.id("saved")),
    value: v.string(),
    hash: v.string(),
    files: v.array(v.id("file")),
    reply: v.optional(v.id("message")),
  },
  handler: async (ctx, args) => {
    const message_id = await ctx.db.insert("message", {
      chat_id: args.chat_id,
      value: args.value,
      edited: false,
      user_id: args.user_id,
      hash: args.hash,
      files: args.files,
      read: false,
      pinned: false,
      reply_id: args.reply,
    });
    await ctx.db.patch(args.chat_id, {
      last_message_id: message_id,
    });
    return message_id;
  },
});

export const readMessage = mutation({
  args: { message_id: v.id("message") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.message_id, {
      read: true,
    });
  },
});

export const getAllPinned = query({
  args: {
    chat_id: v.union(v.id("dialog"), v.id("group"), v.id("channel"), v.id("saved")),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("message")
      .filter((q) => q.eq(q.field("chat_id"), args.chat_id))
      .filter((q) => q.eq(q.field("pinned"), true))
      .order("desc")
      .collect();
  },
});

export const getAll = query({
  args: {
    paginationOpts: paginationOptsValidator,
    chat_id: v.union(v.id("dialog"), v.id("group"), v.id("channel"), v.id("saved")),
  },
  handler: async (ctx, args) => {
    const users = new Map<Id<"user">, Doc<"user"> | null>();
    const messages = await ctx.db
      .query("message")
      .filter((q) => q.eq(q.field("chat_id"), args.chat_id))
      .order("desc")
      .paginate(args.paginationOpts);

    const newPages = [];
    for (const message of messages.page) {
      const objects: Doc<"file">[] = [];
      if (message.files.length > 0) {
        for (const f of message.files) {
          const file = await ctx.db.get(f);
          if (file) objects.push(file);
        }
      }
      let user;
      if (users.has(message.user_id)) {
        user = users.get(message.user_id);
      } else {
        user = await ctx.db.get(message.user_id);
        users.set(message.user_id, user);
      }
      if (message.reply_id) {
        const repliedMessage = await ctx.db.get(message.reply_id);
        if (!repliedMessage) {
          newPages.push({
            ...message,
            objects,
            user,
          });
        } else {
          const repliedUser = await ctx.db.get(repliedMessage.user_id);
          newPages.push({
            ...message,
            user,
            objects,
            reply: {
              message: repliedMessage,
              user: repliedUser,
            },
          });
        }
      } else {
        newPages.push({ ...message, user, objects });
      }
    }

    return {
      ...messages,
      page: newPages,
    };
  },
});
