import start from "../utils/start";
import go from "./go";

function initialize(id: string, localStream: MediaStream) {
  go(id, localStream);
}
start(initialize);
