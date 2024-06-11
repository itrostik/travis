export function reformatDateMessage(time: number) {
  const targetDate = new Date(time);
  return targetDate.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
