/*
 * based on https://github.com/morethanwords/tweb/blob/master/src/lib/cropper.ts
 * Copyright (C) 2019-2021 Eduard Kuzmenko
 * https://github.com/morethanwords/tweb/blob/master/LICENSE
 */

export type CropperType = {
  crop: () => HTMLCanvasElement;
  removeHandlers: () => void;
};

export function cropper(originalImage: HTMLImageElement) {
  let cropImage: HTMLImageElement;
  let canvas: HTMLCanvasElement;
  let cropComponent: HTMLDivElement;
  let container: HTMLDivElement;
  let scaledRatio = 0;
  let cropWidth = 0;
  let cropHeight = 0;
  let cropTop = 0;
  let cropLeft = 0;

  const MIN = 50;
  const CROP_WIDTH = 200;
  const CROP_HEIGHT = 200;

  const event_state: Partial<{
    mouse_x: number;
    mouse_y: number;
    container_width: number;
    container_height: number;
    container_left: number;
    container_top: number;
  }> = {};

  if (originalImage.complete) {
    init();
  } else {
    originalImage.onload = init;
  }
  function init() {
    cropImage = new Image();
    cropImage.src = originalImage.src;
    cropImage.draggable = false;
    cropImage.classList.add("crop-avatar__crop-image");

    canvas = document.createElement("canvas");

    cropComponent = document.createElement("div");
    cropComponent.classList.add("crop-avatar__crop_component");

    container = document.createElement("div");
    container.classList.add("crop-avatar__container");

    const overlayColor = document.createElement("div");
    overlayColor.classList.add("crop-avatar__overlay-color");

    cropComponent.appendChild(container);
    const wrapper = originalImage.parentNode as HTMLElement;
    wrapper.appendChild(cropComponent);
    cropComponent.appendChild(cropImage);
    cropComponent.appendChild(originalImage);
    cropComponent.appendChild(overlayColor);
    container.appendChild(cropImage);

    cropImage.style.maxWidth = originalImage.width + "px";

    scaledRatio = originalImage.naturalWidth / originalImage.offsetWidth;

    const left = originalImage.offsetWidth / 2 - CROP_WIDTH / 2;
    const top = originalImage.offsetHeight / 2 - CROP_HEIGHT / 2;
    updateCropSize(CROP_WIDTH, CROP_HEIGHT);
    updateCropImage(left, top);
    updateContainer(left, top);
    addHandlers();
  }

  function updateCropSize(width: number, height: number) {
    cropWidth = width * scaledRatio;
    cropHeight = height * scaledRatio;

    container.style.width = width + "px";
    container.style.height = height + "px";
  }

  function updateCropImage(left: number, top: number) {
    cropTop = top * scaledRatio;
    cropLeft = left * scaledRatio;

    cropImage.style.top = -top + "px";
    cropImage.style.left = -left + "px";
  }

  function updateContainer(left: number, top: number) {
    container.style.top = top + "px";
    container.style.left = left + "px";
  }

  function removeHandlers() {
    container.removeEventListener("mousedown", startMoving);
    container.removeEventListener("touchstart", startMoving);
    container.removeEventListener("wheel", resizing);

    document.removeEventListener("mouseup", endMoving);
    document.removeEventListener("touchend", endMoving);
    document.removeEventListener("mousemove", moving);
    document.removeEventListener("touchmove", moving);
  }

  function addHandlers() {
    container.addEventListener("mousedown", startMoving, false);
    container.addEventListener("touchstart", startMoving, false);
    container.addEventListener("wheel", resizing, false);
  }
  function saveEventState(e: any) {
    event_state.container_width = container.offsetWidth;
    event_state.container_height = container.offsetHeight;

    event_state.container_left = container.offsetLeft;
    event_state.container_top = container.offsetTop;

    event_state.mouse_x =
      (e.clientX || e.pageX || (e.touches && e.touches[0].clientX)) + window.scrollX;
    event_state.mouse_y =
      (e.clientY || e.pageY || (e.touches && e.touches[0].clientY)) + window.scrollY;
  }

  function imgZoom(zoom: number) {
    zoom = zoom * Math.PI * 2;
    const newWidth = Math.floor(container.clientWidth + zoom),
      newHeight = Math.floor(container.clientHeight + zoom),
      w = cropImage.clientWidth,
      h = cropImage.clientHeight;
    let left: number, top: number;

    if (newWidth < MIN) {
      return;
    } else if (newWidth > w) {
      return;
    }

    left = container.offsetLeft - zoom / 2;
    top = container.offsetTop - zoom / 2;
    const right = left + newWidth;
    const bottom = top + newHeight;

    if (left < 0) left = 0;
    if (top < 0) top = 0;

    if (right > w) return;
    if (bottom > h) return;

    updateCropSize(newWidth, newWidth);
    updateCropImage(left, top);
    updateContainer(left, top);
  }

  function resizing(e: any) {
    e.preventDefault();
    imgZoom(e.deltaY > 0 ? 1 : -1);
  }

  function startMoving(e: MouseEvent | TouchEvent) {
    e.preventDefault();
    e.stopPropagation();
    cropImage.classList.add("crop-avatar__crop-image-grabbing");
    saveEventState(e);

    document.addEventListener("mousemove", moving);
    document.addEventListener("touchmove", moving);
    document.addEventListener("mouseup", endMoving);
    document.addEventListener("touchend", endMoving);
  }

  function endMoving(e: MouseEvent | TouchEvent) {
    e.preventDefault();
    cropImage.classList.remove("crop-avatar__crop-image-grabbing");
    document.removeEventListener("mouseup", endMoving);
    document.removeEventListener("touchend", endMoving);
    document.removeEventListener("mousemove", moving);
    document.removeEventListener("touchmove", moving);
  }

  function moving(e: any) {
    const currentTouch = { x: 0, y: 0 };

    e.preventDefault();
    e.stopPropagation();

    currentTouch.x = e.pageX || (e.touches && e.touches[0].pageX);
    currentTouch.y = e.pageY || (e.touches && e.touches[0].pageY);

    let left = currentTouch.x - (event_state.mouse_x! - event_state.container_left!);
    let top = currentTouch.y - (event_state.mouse_y! - event_state.container_top!);
    const w = container.offsetWidth;
    const h = container.offsetHeight;

    if (left < 0) left = 0;
    else if (left > cropImage.offsetWidth - w) left = cropImage.offsetWidth - w;

    if (top < 0) top = 0;
    else if (top > cropImage.offsetHeight - h) top = cropImage.offsetHeight - h;

    updateCropImage(left, top);
    updateContainer(left, top);
  }

  function crop() {
    canvas.width = cropWidth;
    canvas.height = cropHeight;

    const ctx = canvas.getContext("2d");
    ctx!.drawImage(
      originalImage,
      cropLeft,
      cropTop,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight,
    );

    return canvas;
  }

  return { crop, removeHandlers };
}
