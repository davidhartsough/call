const numberOptions = "10123456789";
const consonants = [
  "b",
  "c",
  "d",
  "f",
  "g",
  "h",
  "j",
  "k",
  "l",
  "m",
  "n",
  "p",
  "r",
  "s",
  "t",
  "v",
  "w",
  "x",
  "y",
  "z",
];
const vowels = ["a", "e", "i", "o", "u"];
const getRandomNumber = (cap) => Math.floor(Math.random() * cap);
const getRandomItem = (arr) => arr[getRandomNumber(arr.length)];
const getRandomConsonant = () => getRandomItem(consonants);
const getRandomVowel = () => getRandomItem(vowels);
const getRandomBool = () => Math.random() >= 0.5;
const getRandomPair = () => getRandomVowel() + getRandomConsonant();
const getNumArray = (total) => [...Array(total)].map((_, i) => i);
function generateRandomWord() {
  let word = Math.random() >= 0.3 ? getRandomConsonant() : getRandomPair();
  word += getRandomPair();
  if (getRandomBool()) {
    word += getRandomVowel();
  }
  return word;
}
function generateRandomId() {
  let id = "";
  let i = 3;
  while (i--) {
    id += numberOptions[(Math.random() * 11) | 0];
  }
  id += "-" + generateRandomWord();
  return id;
}

function getCallId() {
  if (window.location.hash && window.location.hash.length > 7) {
    return window.location.hash.slice(1);
  }
  const newRandomId = generateRandomId();
  window.location.hash = `#${newRandomId}`;
  return newRandomId;
}
const randomId = getCallId();
document.getElementById("call-id").innerText = randomId;

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

function init(pNum) {
  console.log("LETS GO!", pNum);
  const peerId = getPeerId(pNum);
  const peer = new Peer(peerId);
  peer.on("error", (err) => {
    console.log("err:", err);
    console.log("err.type:", err.type);
    console.log("err.message:", err.message);
    if (
      err.message === `ID "${peerId}" is taken` &&
      err.type === "unavailable-id"
    ) {
      peer.destroy();
      console.log("switch player");
      setTimeout(() => {
        init(pNum === 1 ? 2 : 1);
      }, 250);
    }
  });
  peer.on("open", (pId) => {
    console.log("open: pId:", pId);
    if (pNum === 2) {
      const friendsId = getPeerId(1);
      const connection = peer.connect(friendsId);
      connection.on("open", () => {
        console.log("wowo wow we're open !");
        isConnected = true;
        const outboundCall = peer.call(friendsId, localStream);
        outboundCall.on("stream", (remoteStream) => {
          console.log("we in 2");
          console.log("stream:", remoteStream);
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
        });
      });
      setTimeout(() => {
        if (
          !isConnected &&
          peer.getConnection(getPeerId(1)) === null &&
          peer.getConnection(getPeerId(3)) === null
        ) {
          peer.destroy();
          setTimeout(() => {
            init(1);
          }, 250);
        }
      }, 3000);
    } else if (pNum === 1) {
      setTimeout(() => {
        if (!isConnected && peer.getConnection(getPeerId(2)) === null) {
          peer.destroy();
          setTimeout(() => {
            init(2);
          }, 250);
        }
      }, 2500);
    }
  });
  peer.on("connection", (connection) => {
    console.log("potential connection:", pNum);
    isConnected = true;
    connection.on("open", () => {
      isConnected = true;
      console.log("wowo we're open:", pNum);
      console.log("THIS IS A WEIRD CASE THO?");
    });
  });
  peer.on("call", (inboundCall) => {
    console.log("HELLLO inbound call");
    inboundCall.answer(localStream);
    inboundCall.on("stream", (remoteStream) => {
      console.log("we in 1");
      console.log("stream:", remoteStream);
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
    });
  });
}

const micOnIcon = document.getElementById("mic-on");
const micOffIcon = document.getElementById("mic-off");
function toggleMic() {
  const isOn = micToggleBtn.className === "on";
  micToggleBtn.className = isOn ? "off" : "on";
  micOnIcon.style = `display: ${isOn ? "none" : "block"}`;
  micOffIcon.style = `display: ${isOn ? "block" : "none"}`;
  if (localStream) {
    localStream.getAudioTracks()[0].enabled = !isOn;
  }
  micToggleBtn.blur();
}
micToggleBtn.onclick = toggleMic;
