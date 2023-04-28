import Peer from "peerjs";
import play from "../utils/play";

function openCall(peerId: string, localStream: MediaStream) {
  const peer = new Peer(peerId);
  const handleError = (err: Error) => {
    console.log("err:", err);
    peer.destroy();
    openCall(peerId, localStream);
  };
  peer.on("error", handleError);
  peer.on("call", (call) => {
    call.answer(localStream);
    call.on("stream", play);
    call.on("error", handleError);
  });
}

export default function setupHost(id: string, localStream: MediaStream) {
  openCall(id, localStream);
}
