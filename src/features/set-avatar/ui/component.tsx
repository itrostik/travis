import { useRef, useState } from "react";
import { UseFormSetValue } from "react-hook-form";

import { FormInterface } from "../..";
import { useFiles } from "../../../entities";
import { i18nType, MiniLoading, Portal, UploadWrapper } from "../../../shared";
import { CropperType } from "../lib";

import { Crop } from "./crop";
import styles from "./set-avatar.module.scss";
import Image from "next/image";

import { Check, ImagePlus } from "lucide-react";

export function Avatar({
  setValue,
  avatar,
  i18n,
}: {
  setValue: UseFormSetValue<FormInterface>;
  avatar: string;
  i18n: i18nType;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [avatarValue, setAvatarValue] = useState(avatar);
  const [loading, setLoading] = useState(false);
  const cropper = useRef<CropperType | null>(null);
  const { uploadBlob } = useFiles();

  const handleDone = () => {
    if (cropper.current) {
      setLoading(true);
      const c = cropper.current!.crop();
      c.toBlob(async (blob) => {
        if (blob) {
          const data = await uploadBlob([blob]);
          if (data.length > 0) {
            setAvatarValue(data[0].url);
            setValue("avatar", data[0].url);
          }
          setLoading(false);
        } else {
          setLoading(false);
        }
      });
      cropper.current!.removeHandlers();
    }
    setFile(null);
    cropper.current = null;
  };

  return (
    <div className={styles.avatar}>
      <div className={styles.block}>
        <Image
          priority
          src={avatarValue}
          alt="avatar"
          width={120}
          height={120}
          className={styles.image}
        />
        {loading ? (
          <MiniLoading className={styles.button} />
        ) : (
          <UploadWrapper
            onUpload={(files) => {
              if (files.length > 0) setFile(files[0]);
            }}
            accept="image/*"
            multiple={false}
          >
            <ImagePlus size={16} className={styles.button} />
          </UploadWrapper>
        )}
      </div>
      {file && (
        <Portal
          close={() => {
            setFile(null);
            cropper.current = null;
          }}
          title={i18n.changeProfile.crop}
        >
          <Crop file={file} cropp={cropper} />
          <button className={styles.done} onClick={handleDone}>
            <Check width={20} />
          </button>
        </Portal>
      )}
    </div>
  );
}
