import React, { RefObject, useEffect, useState } from "react";

export function useResize(
  ref: RefObject<HTMLDivElement>,
  maxWidth: number,
  minWidth: number,
  standardWidth: number,
) {
  const [width, setWidth] = useState(0);
  const [x, setX] = useState(0);

  useEffect(() => {
    if (!ref.current!.style.width) {
      ref.current!.style.width = `${standardWidth}px`;
    }
  }, []);
  function initResize(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    e.preventDefault();
    setX(e.clientX);
    setWidth(ref.current!.offsetWidth);
    addHandlers();
  }

  function cleanup() {
    document.body.classList.remove("resize");
    document.body.removeEventListener("mousemove", drag);
    document.body.removeEventListener("mouseup", cleanup);
  }

  function drag(e: MouseEvent) {
    let cur = e.clientX + width - x;
    if (cur > maxWidth) cur = maxWidth;
    if (cur < minWidth) cur = minWidth;
    ref.current!.style.width = `${cur}px`;
  }

  function addHandlers() {
    document.body.classList.add("resize");
    document.body.addEventListener("mousemove", drag);
    document.body.addEventListener("mouseup", cleanup);
  }

  function resetSize(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    e.preventDefault();
    ref.current!.style.width = `${standardWidth}px`;
  }

  return { initResize, resetSize };
}
