import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const store = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("user")
      .withIndex("email", (q) => q.eq("email", args.email))
      .unique();
    if (user !== null) return user;
    return null;
  },
});

export const create = mutation({
  args: {
    email: v.string(),
    username: v.string(),
    about: v.string(),
    name: v.string(),
    locales: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("user")
      .withIndex("username", (q) => q.eq("username", args.username))
      .unique();
    if (!!user) throw new Error("такой username уже занят");
    const created_user = await ctx.db.insert("user", {
      username: args.username,
      email: args.email,
      locales: args.locales,
      about: args.about,
      name: args.name,
      avatar_url: "https://i.ibb.co/XbKhr5X/avatar.jpg", // ругался convex на импорт константы из-за того, что в shared.index.ts.ts не только просто ts файлы, но и tsx присутствует
    });

    const saved = await ctx.db.insert("saved", {
      name: "saved",
      about: "",
      avatar_url: "https://i.ibb.co/XbKhr5X/avatar.jpg",
    });

    await ctx.db.insert("user_chat", {
      pinned: false,
      user_id: created_user,
      chat_id: saved,
      type: "saved",
    });

    return created_user;
  },
});

export const checkUsername = mutation({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("user")
      .withIndex("username", (q) => q.eq("username", args.username))
      .unique();
    return !!user;
  },
});

export const devGetAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("user").collect();
  },
});

export const edit = mutation({
  args: {
    user_id: v.id("user"),
    username: v.string(),
    about: v.string(),
    name: v.string(),
    locales: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.user_id, {
      username: args.username,
      about: args.about,
      name: args.name,
      locales: args.locales,
    });
  },
});

export const switchLang = mutation({
  args: {
    user_id: v.id("user"),
    locales: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.user_id, {
      locales: args.locales,
    });
  },
});

export const find = mutation({
  args: { value: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("user")
      .withSearchIndex("search", (q) => q.search("username", args.value))
      .collect();
  },
});
