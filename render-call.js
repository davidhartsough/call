const audioElement = document.getElementById("remote-audio-stream");
const micToggleBtn = document.getElementById("mic-toggle");
const loaderElement = document.getElementById("loader");
const callNumberText = document.getElementById("call-number");
const msgElement = document.getElementById("msg");

export default function renderCall(remoteStream) {
  audioElement.srcObject = remoteStream;
  audioElement.play();
  micToggleBtn.style = "display: block";
  loaderElement.style = "display: none";
  callNumberText.style = "opacity: 0.5";
  msgElement.style = "opacity: 0.5";
  msgElement.innerText = "Connected";
}
