let retryCount = 0;
let timeout = 0;
export default function waitAndRetry(callback: () => void) {
  clearTimeout(timeout);
  const timer = retryCount * 2000;
  timeout = setTimeout(() => {
    retryCount++;
    callback();
  }, timer);
}
