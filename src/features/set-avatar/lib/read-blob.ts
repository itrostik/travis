export function ReadBlobAsDataURL(blob: Blob) {
  return new Promise<any>((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("loadend", (e) => {
      resolve(e.target!.result);
    });
    reader["readAsDataURL"](blob);
  });
}
