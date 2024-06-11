export function calculateSizeFile(size: number | undefined): {
  value: string;
  type: "b" | "kb" | "mb";
} {
  if (!size) return { value: "0", type: "b" };
  if (size < 1024) return { value: `${size}`, type: "b" };
  if (size < 1024 * 512) return { value: `${(size / 1024).toFixed(2)}`, type: "kb" };
  return { value: `${(size / 1024 ** 2).toFixed(2)}`, type: "mb" };
}
