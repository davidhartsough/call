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
  peer.on("open", (pId) => {
    const hostId = `${pId.slice(0, -1)}1`;
    const call = peer.call(hostId, localStream);
    call.on("stream", play);
    call.on("error", handleError);
  });
}

export default function setupGuest(id: string, localStream: MediaStream) {
  openCall(id, localStream);
}
