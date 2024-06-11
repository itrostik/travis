import { ChatType, DialogInterface, SavedInterface } from "../src/entities";

import { Doc } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";

export const pin = mutation({
  args: {
    pinned: v.boolean(),
    chat_id: v.id("user_chat"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.chat_id, {
      pinned: args.pinned,
    });
  },
});

export const getChats = query({
  args: { user_id: v.id("user") },
  handler: async (ctx, args) => {
    //получаю чаты из user_chat
    const chats = await ctx.db
      .query("user_chat")
      .withIndex("user_id", (q) => q.eq("user_id", args.user_id))
      .collect();

    //результат
    const result: ChatType[] = [];

    //проходимся по чатам
    for (let chat of chats) {
      //если чат - диалог, то
      if (chat.type === "dialog") {
        //получаем нужные данные
        const dialog = (await ctx.db.get(chat.chat_id)) as Doc<"dialog">;
        if (!dialog) throw new ConvexError("Диалог не найден");
        const first_user = await ctx.db.get(dialog.first_user_id);
        const second_user = await ctx.db.get(dialog.second_user_id);
        if (first_user === null || second_user === null) {
          throw new ConvexError("пользователи не определены");
        }
        let last_message = null; //тут можно изменить, если надо
        if (dialog.last_message_id) {
          last_message = await ctx.db.get(dialog.last_message_id);
        }

        //формируем объект для результирующего массива
        // @ts-ignore
        const chatObject: DialogInterface = {
          ...chat,
          chat: {
            ...dialog,
            user: first_user?._id !== args.user_id ? first_user : second_user,
            last_message,
          },
        };
        result.push(chatObject);
      } else if (chat.type === "saved") {
        const chatItem = (await ctx.db.get(chat.chat_id)) as Doc<"saved">;
        if (!chatItem) throw new ConvexError("Диалог не найден");
        let last_message = null;
        if (chatItem.last_message_id) {
          last_message = await ctx.db.get(chatItem.last_message_id);
        }
        // @ts-ignore
        const chatObject: SavedInterface = {
          ...chat,
          chat: {
            ...chatItem,
            last_message,
          },
        };
        result.push(chatObject);
      }
    }

    //сортирую сначала по полю pinned, потом по времени
    result.sort((a, b) => {
      const a_pinned = a.pinned ? 1 : 0;
      const b_pinned = b.pinned ? 1 : 0;
      const a_time = a.chat.last_message
        ? a.chat.last_message._creationTime
        : a.chat._creationTime;
      const b_time = b.chat.last_message
        ? b.chat.last_message._creationTime
        : b.chat._creationTime;
      return b_pinned - a_pinned || b_time - a_time; //типа если pinned одинаковый, то сортировать по времени последнего сообщения (или по времени создания чата)
    });

    return result;
  },
});
