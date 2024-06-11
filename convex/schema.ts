import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  file: defineTable({
    storage: v.id("_storage"),
    url: v.string(),
    size: v.number(),
    name: v.string(),
  }),

  user: defineTable({
    email: v.string(),
    username: v.string(),
    name: v.string(),
    about: v.string(),
    locales: v.number(),
    avatar_url: v.string(),
  })
    .index("email", ["email"])
    .index("username", ["username"])
    .searchIndex("search", {
      searchField: "username",
    }),
  user_avatar: defineTable({
    url: v.string(),
    user_id: v.id("user"),
  }).index("user_id", ["user_id"]),
  user_chat: defineTable({
    user_id: v.id("user"),
    chat_id: v.union(v.id("dialog"), v.id("saved")),
    type: v.union(v.literal("dialog"), v.literal("saved")),
    pinned: v.boolean(),
  })
    .index("user_id", ["user_id"])
    .index("chat_id", ["chat_id"]),
  dialog: defineTable({
    first_user_id: v.id("user"),
    second_user_id: v.id("user"),
    last_message_id: v.optional(v.id("message")),
  }),
  message: defineTable({
    user_id: v.id("user"),
    chat_id: v.union(v.id("dialog"), v.id("saved")),
    edited: v.boolean(),
    reply_id: v.optional(v.id("message")),
    value: v.string(),
    hash: v.string(),
    files: v.array(v.id("file")),
    read: v.boolean(),
    pinned: v.boolean(),
  }),
  saved: defineTable({
    avatar_url: v.string(),
    name: v.string(),
    about: v.string(),
    last_message_id: v.optional(v.id("message")),
  }),
});
