const actionText = document.getElementById("action")!;
const shareButton = <HTMLButtonElement>document.getElementById("share")!;
const url = window.location.toString();
const shareData = {
  url,
  text: "Hop on this call with me",
  title: "Call Me Up",
};
async function copy() {
  await navigator.clipboard.writeText(url);
  actionText.innerText = "✓ Copied";
}
const shareLink = () => navigator.share(shareData);

export default function setupShare() {
  if (navigator.canShare && navigator.canShare(shareData)) {
    shareButton.onclick = shareLink;
  } else {
    shareButton.onclick = copy;
    actionText.innerText = "Copy the link";
    document.getElementById("share-icon")!.style.display = "none";
    document.getElementById("copy-icon")!.style.display = "block";
  }
}
