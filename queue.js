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
export function wait(callback) {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    retry();
    callback();
  }, getRetryTimer());
}

let reinitTimer = undefined;
export function reinit(nextPNum) {
  clearTimeout(timeout);
  clearTimeout(reinitTimer);
  reinitTimer = setTimeout(() => {
    retry();
    init(nextPNum);
  }, 250);
}

export function knockKnock() {
  someonesThere = true;
  noonesThere = false;
  document.getElementById("msg").innerText = "Connecting...";
}
