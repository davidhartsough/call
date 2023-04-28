import start from "../utils/start";
import setupGuest from "./guest";
import setupHost from "./host";

function checkIfHost(id: string): boolean {
  const storedId = window.sessionStorage.getItem("call");
  const host = window.sessionStorage.getItem("host");
  window.sessionStorage.clear();
  return id === storedId && id === host;
}
function initialize(id: string, localStream: MediaStream) {
  const isHost = checkIfHost(id);
  const peerId = `call-me-up-${id}-${isHost ? 1 : 2}`;
  if (isHost) {
    setupHost(peerId, localStream);
  } else {
    setupGuest(peerId, localStream);
  }
}
start(initialize);
