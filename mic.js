export default function setupMic(localStream) {
  const micToggleBtn = document.getElementById("mic-toggle");
  const micOnIcon = document.getElementById("mic-on");
  const micOffIcon = document.getElementById("mic-off");
  function toggleMic() {
    const isOn = micToggleBtn.className === "on";
    micToggleBtn.className = isOn ? "off" : "on";
    micOnIcon.style = `display: ${isOn ? "none" : "block"}`;
    micOffIcon.style = `display: ${isOn ? "block" : "none"}`;
    if (window.localStream) {
      window.localStream.getAudioTracks()[0].enabled = !isOn;
    }
    micToggleBtn.blur();
  }
  micToggleBtn.onclick = toggleMic;
}
