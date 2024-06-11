import { soc } from "../..";
import { Doc } from "../../../../convex/_generated/dataModel";

import styles from "./file-icon.module.scss";

export function FileIcon({
  file,
  object,
  gray,
}: {
  file?: File;
  object?: Doc<"file">;
  gray: boolean;
}) {
  if (file) {
    const extension = file.name.split(".").at(-1);
    return (
      <div className={soc(styles.wrapper, styles.gray, gray)} data-gray={gray}>
        {extension === "png" || extension === "jpg" || extension === "jpeg" ? (
          <img src={URL.createObjectURL(file)} className={styles.image} />
        ) : (
          extension
        )}
      </div>
    );
  }
  if (object) {
    const extension = object.name.split(".").at(-1);
    return (
      <div className={soc(styles.wrapper, styles.gray, gray)}>
        {extension === "png" || extension === "jpg" || extension === "jpeg" ? (
          <img src={object.url} className={styles.image} />
        ) : (
          extension
        )}
      </div>
    );
  }
  return "";
}
