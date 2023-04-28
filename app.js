import setupMic from "./mic.js";

navigator.mediaDevices
  .getUserMedia({
    audio: true,
    video: false,
  })
  .then((localStream) => {
    window.localStream = localStream;
    init(1);
    setupMic();
  });
