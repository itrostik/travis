import { api } from "../../../convex/_generated/api";
import { Doc, Id } from "../../../convex/_generated/dataModel";

import { useMutation } from "convex/react";
import ky from "ky";

export function useFiles() {
  const generateUrl = useMutation(api.file.generateUploadUrl);
  const create = useMutation(api.file.createFile);
  const uploadFile = async (files: File[]) => {
    const res: Doc<"file">[] = [];
    const uploadUrl = await generateUrl();
    for (const file of files) {
      const result: { storageId: Id<"_storage"> } = await ky
        .post(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type || "application/octet-stream" },
          body: file,
        })
        .json();
      const data = await create({
        storageId: result.storageId,
        name: file.name,
        size: file.size,
      });
      if (data) res.push(data);
    }
    return res;
  };

  const uploadBlob = async (files: Blob[]) => {
    const res: Doc<"file">[] = [];
    const uploadUrl = await generateUrl();
    for (const file of files) {
      const result: { storageId: Id<"_storage"> } = await ky
        .post(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type || "application/octet-stream" },
          body: file,
        })
        .json();
      const data = await create({
        storageId: result.storageId,
        name: "",
        size: file.size,
      });
      if (data) res.push(data);
    }
    return res;
  };

  return { uploadFile, uploadBlob };
}
