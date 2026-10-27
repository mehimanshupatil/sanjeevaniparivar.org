export { cn } from "cn";

/** Saves a Blob or File as a download. The URL is revoked a moment later: revoking at once can cancel the download. */
export function downloadFile(blob: Blob, name: string) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
