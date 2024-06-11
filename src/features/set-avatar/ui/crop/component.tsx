import { MutableRefObject, useEffect, useRef } from "react";

import { cropper, ReadBlobAsDataURL, CropperType } from "../../lib";

import "./component.scss";

export function Crop({
  file,
  cropp,
}: {
  file: File;
  cropp: MutableRefObject<CropperType | null>;
}) {
  const originalImage = useRef<HTMLImageElement>(null);
  useEffect(() => {
    if (!cropp.current) {
      ReadBlobAsDataURL(file).then((res) => {
        originalImage.current!.src = res;
        originalImage.current!.onload = () => {
          cropp.current = cropper(originalImage.current!);
        };
      });
    }
  }, [file]);

  return (
    <div className="crop-avatar__wrapper">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src=""
        ref={originalImage}
        className="crop-avatar__original-image"
        draggable={false}
        alt="crop avatar"
      />
    </div>
  );
}
