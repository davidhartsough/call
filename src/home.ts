const charOptions =
  "a0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1";
function generateRandomId(): string {
  let id = "";
  let i = 8;
  while (i--) {
    id += charOptions[(Math.random() * 64) | 0];
  }
  return id;
}
const callId = generateRandomId();
const linkElement = <HTMLAnchorElement>document.getElementById("start-call")!;
linkElement.href = `./c/?p=${callId}`;
window.sessionStorage.setItem("call", callId);
function saveToSession() {
  window.sessionStorage.setItem("host", "true");
}
linkElement.onclick = saveToSession;

// Schedule for later
const linkForLater = `https://call-me-up.web.app/s/${generateRandomId()}`;
const encodedDetails = encodeURIComponent(linkForLater);
const linkToGCal = `https://calendar.google.com/calendar/r/eventedit?details=${encodedDetails}&dates=now`;
const scheduleLink = <HTMLAnchorElement>document.getElementById("schedule")!;
scheduleLink.href = linkToGCal;
