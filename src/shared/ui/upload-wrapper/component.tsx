import { useEffect, useState } from "react";

import { MiniLoading } from "../..";

import { PropsType } from "./types";
import styles from "./upload-wrapper.module.scss";

export function UploadWrapper({ children, onUpload, multiple, accept }: PropsType) {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (files.length > 0) {
      setIsLoading(true);
      onUpload(files);
      setIsLoading(false);
    }
  }, [files]);

  return (
    <>
      {isLoading ? (
        <MiniLoading />
      ) : (
        <>
          <input
            type="file"
            id="upload"
            className={styles.upload}
            multiple={multiple}
            accept={accept}
            onChange={(e) => setFiles(Array.from(e.target.files || []))}
          />
          <label htmlFor="upload">{children}</label>
        </>
      )}
    </>
  );
}
