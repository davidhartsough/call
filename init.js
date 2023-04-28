import renderCall from "./render-call.js";
import getCallId from "get-id.js"; // TODO

let isConnected = false;
function confirmConnection() {
  isConnected = true;
}
function connectCall(remoteStream) {
  confirmConnection();
  renderCall(remoteStream);
  retryCount = 0;
}

let callId = null; // TODO
const getPeerId = (pNum) => `good-call-${callId}-${pNum}`;
const Peer = window.Peer;
export default function init(pNum) {
  const peerId = getPeerId(pNum);
  const peer = new Peer(peerId);
  console.log("init:", peerId);
  const reset = (nextPNum) => {
    peer.destroy();
    reinit(nextPNum);
  };
  const handleError = (err, nextPNum) => {
    console.log("err.type:", err.type);
    console.log("err.message:", err.message);
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
