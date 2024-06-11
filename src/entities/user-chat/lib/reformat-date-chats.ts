//тут переменная locale - это локаль (строка формата ru-RU или en-US)
export function reformatDateChats(time: number, locale: string) {
  const currentDate = new Date();
  const targetDate = new Date(time);

  const diffTime = currentDate.getTime() - targetDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));

  if (diffDays === 0) {
    return targetDate.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (diffDays < 7) {
    return targetDate.toLocaleDateString(locale, { weekday: "short" });
  } else {
    return targetDate.toLocaleDateString("ru-RU", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
    });
  }
}
