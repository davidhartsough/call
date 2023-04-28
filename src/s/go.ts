import Peer from "peerjs";
import play from "../utils/play";
import waitAndRetry from "./retry";

let isHost = true;
const getPeerId = (id: string, pNum: number) => `call-me-up-${id}-${pNum}`;

function openCall(id: string, localStream: MediaStream) {
  const peerId = getPeerId(id, isHost ? 1 : 2);
  const peer = new Peer(peerId);
  const reset = () => {
    peer.destroy();
    openCall(id, localStream);
  };
  const handleError = (err: Error) => {
    console.log("err:", err.message);
    reset();
  };
  peer.on("error", (err) => {
    if (err.message === `ID "${peerId}" is taken`) {
      isHost = false;
      return reset();
    }
    if (err.message === `Could not connect to peer ${getPeerId(id, 2)}`) {
      return waitAndRetry(reset);
    }
    handleError(err);
  });
  peer.on("open", () => {
    const otherId = getPeerId(id, isHost ? 2 : 1);
    const call = peer.call(otherId, localStream);
    call.on("stream", play);
    call.on("error", handleError);
  });
  peer.on("call", (call) => {
    call.answer(localStream);
    call.on("stream", play);
    call.on("error", handleError);
  });
}

export default function go(id: string, localStream: MediaStream) {
  openCall(id, localStream);
}
