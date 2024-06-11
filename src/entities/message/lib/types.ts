import { Doc, Id } from "../../../../convex/_generated/dataModel";

export type MessageType = {
  user:
    | {
        _id: Id<"user">;
        _creationTime: number;
        name: string;
        email: string;
        username: string;
        about: string;
        locales: number;
        avatar_url: string;
      }
    | null
    | undefined;
  reply?: {
    message: {
      _id: Id<"message">;
      _creationTime: number;
      value: string;
    };
    user: {
      name: string;
    } | null;
  };
  _id: Id<"message">;
  value: string;
  user_id: Id<"user">;
  chat_id: Id<"dialog"> | Id<"saved">;
  edited: boolean;
  reply_id?: Id<"message">;
  objects: Doc<"file">[];
  files: Id<"file">[];
  hash: string;
  read: boolean;
  pinned: boolean;
  _creationTime: number;
};

export type NewMessageType = {
  value: string;
  hash: string;
  chat: Id<"user_chat">;
  chat_id: Id<"dialog"> | Id<"saved">;
  user_id: Id<"user">;
  date: Date;
  files: File[];
  reply: MessageType | null;
};

export interface BlockInterface {
  type: "date" | "sending" | "initial";
  date: number;
  hash: string;
}
export interface BlockInitialInterface extends BlockInterface {
  type: "initial";
  m: MessageType;
}

export interface BlockDateInterface extends BlockInterface {
  type: "date";
  d: string;
}

export interface BlockSendingInterface extends BlockInterface {
  type: "sending";
  value: string;
  user: Id<"user">;
  chat: Id<"dialog"> | Id<"saved">;
  files: File[];
  reply: MessageType | null;
}

export type BlockType =
  | BlockInitialInterface
  | BlockDateInterface
  | BlockSendingInterface;
