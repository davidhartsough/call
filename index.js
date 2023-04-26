const Peer = window.Peer;
const audioElement = document.getElementById("remote-audio-stream");
const randomId = "asdf";
// function playRemoteStream(remoteStream) {
//   audioElement.srcObject = remoteStream;
//   audioElement.play();
// }

const peerConfig = {
  // host: "localhost",
  // host: "https://daves-peer-server.glitch.me/",
  host: "https://audio-voice-call.onrender.com",
  port: 9000,
  path: "/p",
  key: "peerjs",
};

async function init(number) {
  console.log("LETS GO!", number);
  const localStream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false,
  });
  const peerId = `${randomId}${number}`;
  const peer = new Peer(peerId, peerConfig);
  peer.on("error", (err) => {
    console.log("err:", err);
    console.log("err.type:", err.type);
    console.log("err.message:", err.message);
    if (
      err.message === `ID "${peerId}" is taken` &&
      err.type === "unavailable-id"
    ) {
      peer.destroy();
      console.log("switch to player two");
      init(2);
    }
  });
  peer.on("open", (pId) => {
    console.log("open: pId:", pId);
    if (number === 2) {
      const connection = peer.connect(`${randomId}1`);
      connection.on("open", () => {
        console.log("wowo wow we're open !");
        const outboundCall = peer.call(`${randomId}1`, localStream);
        outboundCall.on("stream", (remoteStream) => {
          console.log("we in 2");
          console.log("stream:", remoteStream);
          audioElement.srcObject = remoteStream;
          audioElement.play();
        });
        outboundCall.on("error", (err) => {
          console.log("err outbound call:", err);
        });
      });
    }
  });
  peer.on("connection", (connection) => {
    console.log("potential connection:", number);
    connection.on("open", () => {
      console.log("wowo we're open:", number);
    });
  });
  peer.on("call", (inboundCall) => {
    console.log("HELLLO inbound call");
    inboundCall.answer(localStream);
    inboundCall.on("stream", (remoteStream) => {
      console.log("we in 1");
      console.log("stream:", remoteStream);
      audioElement.srcObject = remoteStream;
      audioElement.play();
    });
    inboundCall.on("error", (err) => {
      console.log("err inbound:", err);
    });
  });
  console.log("BOTTOM");
}

init(1);
