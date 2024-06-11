import { ReactNode } from "react";

export type PropsType = {
  children: ReactNode;
  onUpload: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
};
