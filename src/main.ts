// repl.js actually refers to repl.ts
import { startREPL } from "./repl.js";
import { State,initState } from "./state.js";

function main() {
  const state: State = initState();
  try {
  startREPL(state);
}catch (err) {
  console.error("Error starting REPL:", err); 
}
}

main();
