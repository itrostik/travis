/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * Generated by convex@1.11.0.
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as dialog from "../dialog.js";
import type * as file from "../file.js";
import type * as info from "../info.js";
import type * as message from "../message.js";
import type * as user from "../user.js";
import type * as user_avatar from "../user_avatar.js";
import type * as user_chat from "../user_chat.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  dialog: typeof dialog;
  file: typeof file;
  info: typeof info;
  message: typeof message;
  user: typeof user;
  user_avatar: typeof user_avatar;
  user_chat: typeof user_chat;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
