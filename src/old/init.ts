/*
import Peer from "peerjs";
import play from "../utils/play";

let isConnected = false;
function confirmConnection() {
  isConnected = true;
}
function connectCall(remoteStream: MediaStream) {
  confirmConnection();
  play(remoteStream);
  retryCount = 0;
}

let callId = "asdf";
const getPeerId = (pNum: number) => `good-call-${callId}-${pNum}`;
export default function init(pNum: number) {
  const peerId = getPeerId(pNum);
  const peer = new Peer(peerId);
  console.log("init:", peerId);
  const reset = (nextPNum: number) => {
    peer.destroy();
    reinit(nextPNum);
  };
  const handleError = (err: Error, nextPNum: number) => {
    console.log("err:", err);
    reset(nextPNum);
  };
  peer.on("error", (err) => {
    if (
      err.message === `ID "${peerId}" is taken` &&
      err.type === "unavailable-id"
    ) {
      knockKnock();
      const nextPNum = pNum === 1 ? 2 : 1;
      handleError(err, nextPNum);
    } else {
      handleError(err, 1);
    }
  });
  peer.on("open", (pId) => {
    console.log("open:", pId);
    const friendsId = getPeerId(pNum === 2 ? 1 : 2);
    const connection = peer.connect(friendsId);
    connection.on("open", () => {
      confirmConnection();
      const outboundCall = peer.call(friendsId, localStream);
      outboundCall.on("stream", connectCall);
      outboundCall.on("error", (err) => handleError(err, pNum));
    });
    wait(() => {
      if (!isConnected && peer.getConnection(friendsId) === null) {
        reset(getRandomBool() ? 1 : 2);
      }
    });
  });
  peer.on("connection", (connection) => {
    confirmConnection();
    connection.on("open", confirmConnection);
  });
  peer.on("call", (inboundCall) => {
    inboundCall.answer(localStream);
    inboundCall.on("stream", connectCall);
    inboundCall.on("error", (err) => handleError(err, pNum));
  });
}
*/
