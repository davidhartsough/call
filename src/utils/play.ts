const audioElement = <HTMLAudioElement>(
  document.getElementById("remote-audio-stream")!
);
const msgElement = document.getElementById("msg")!;

export default function play(remoteStream: MediaStream) {
  msgElement.innerText = "Connected";
  msgElement.style.opacity = "0.5";
  document.getElementById("mic-toggle")!.style.display = "block";
  document.getElementById("loader")!.style.display = "none";
  document.getElementById("share")!.style.display = "none";
  document.getElementById("action")!.style.display = "none";
  audioElement.srcObject = remoteStream;
  audioElement.play();
}
