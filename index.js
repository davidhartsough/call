// import getCallId from "get-id.js";
const randomId = getCallId();

const Peer = window.Peer;
const audioElement = document.getElementById("remote-audio-stream");
let localStream = null;
async function getLocalStream() {
  localStream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false,
  });
  init(1);
}
getLocalStream();

function getPeerId(pNum) {
  return `good-call-${randomId}-${pNum}`;
}

const micToggleBtn = document.getElementById("mic-toggle");
const loaderElement = document.getElementById("loader");
const callNumberText = document.getElementById("call-number");
const msgElement = document.getElementById("msg");

let isConnected = false;
let someonesThere = false;
let noonesThere = false;
let retryCount = 0;
function retry() {
  retryCount++;
  if (retryCount === 10 && !someonesThere) {
    noonesThere = true;
  }
}

const minTimer = 1000;
const randomTimer = (max) =>
  Math.floor(Math.random() * (max - minTimer)) + minTimer;
const timerMax = 4000;
function getRetryTimer() {
  if (someonesThere) return 250;
  if (noonesThere) return retryCount * minTimer;
  return randomTimer(timerMax);
}
let timeout = undefined;
function wait(callback) {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    retryCount++;
    callback();
  }, getRetryTimer());
}

let reinitTimer = undefined;
function reinit(nextPNum) {
  clearTimeout(timeout);
  clearTimeout(reinitTimer);
  reinitTimer = setTimeout(() => {
    retryCount++;
    init(nextPNum);
  }, 250);
}

function init(pNum) {
  const peerId = getPeerId(pNum);
  const peer = new Peer(peerId);
  console.log("init:", peerId);
  peer.on("error", (err) => {
    console.log("err.type:", err.type);
    console.log("err.message:", err.message);
    if (
      err.message === `ID "${peerId}" is taken` &&
      err.type === "unavailable-id"
    ) {
      peer.destroy();
      someonesThere = true;
      msgElement.innerText = "Connecting...";
      const nextPNum = pNum === 1 ? 2 : 1;
      reinit(nextPNum);
    } else {
      peer.destroy();
      reinit(1);
    }
  });
  peer.on("open", (pId) => {
    console.log("open:", pId);
    const friendsId = getPeerId(pNum === 2 ? 1 : 2);
    const connection = peer.connect(friendsId);
    connection.on("open", () => {
      isConnected = true;
      const outboundCall = peer.call(friendsId, localStream);
      outboundCall.on("stream", (remoteStream) => {
        isConnected = true;
        audioElement.srcObject = remoteStream;
        audioElement.play();
        micToggleBtn.style = "display: block";
        loaderElement.style = "display: none";
        callNumberText.style = "opacity: 0.5";
        msgElement.style = "opacity: 0.5";
        msgElement.innerText = "Connected";
      });
      outboundCall.on("error", (err) => {
        console.log("err outbound call:", err);
        peer.destroy();
        reinit(pNum);
      });
    });
    wait(() => {
      if (!isConnected && peer.getConnection(friendsId) === null) {
        peer.destroy();
        reinit(getRandomBool() ? 1 : 2);
      }
    });
  });
  peer.on("connection", (connection) => {
    isConnected = true;
    connection.on("open", () => {
      isConnected = true;
    });
  });
  peer.on("call", (inboundCall) => {
    inboundCall.answer(localStream);
    inboundCall.on("stream", (remoteStream) => {
      isConnected = true;
      audioElement.srcObject = remoteStream;
      audioElement.play();
      micToggleBtn.style = "display: block";
      loaderElement.style = "display: none";
      callNumberText.style = "opacity: 0.5";
      msgElement.style = "opacity: 0.5";
      msgElement.innerText = "Connected";
    });
    inboundCall.on("error", (err) => {
      console.log("err inbound:", err);
      peer.destroy();
      reinit(pNum);
    });
  });
}
