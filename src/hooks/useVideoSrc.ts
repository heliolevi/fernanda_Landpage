import { useMemo } from "react";

/** Escolhe mp4 (H.264) quando o navegador toca, senão cai para WebM. */
export function pickVideoExt(): "mp4" | "webm" {
  if (typeof document === "undefined") return "mp4";
  const v = document.createElement("video");
  if (v.canPlayType('video/mp4; codecs="avc1.42E01E"')) return "mp4";
  return "webm";
}

export function useVideoSrc(base: string) {
  return useMemo(() => `${base}.${pickVideoExt()}`, [base]);
}
