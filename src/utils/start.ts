import setupMic from "./mic";
import setupShare from "./share";

export type CallbackFunc = (id: string, localStream: MediaStream) => void;
export default async function start(callback: CallbackFunc) {
  const searchParams = new URLSearchParams(document.location.search);
  const id = searchParams.get("p");
  if (!id || id.length < 4) return window.location.replace("../");
  setupShare();
  const localStream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false,
  });
  setupMic(localStream);
  callback(id, localStream);
}
