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

export default function getCallId() {
  if (window.location.hash && window.location.hash.length > 7) {
    return window.location.hash.slice(1);
  }
  const newRandomId = generateRandomId();
  window.location.hash = `#${newRandomId}`;
  document.getElementById("call-id").innerText = randomId;
  return newRandomId;
}
