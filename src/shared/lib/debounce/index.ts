export function debounce(callback: () => {}, time: number) {
  let timeout: NodeJS.Timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(callback, time);
  };
}
