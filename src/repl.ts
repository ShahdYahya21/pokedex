// src/repl.ts
import readline from "node:readline";
import { CLICommand,State } from "./state.js";
import { PokeAPI } from "./pokeapi.js";
// ------------------
// Command utilities
// ------------------

export function cleanInput(input: string): string[] {
  return input
    .trim()               // remove leading/trailing whitespace
    .toLowerCase()        // lowercase everything
    .split(/\s+/)         // split by one or more spaces
    .filter(Boolean);     // remove empty strings
}


// ------------------
// REPL logic
// ------------------

export async function startREPL(State: State) {
  const { rl, commands, pokeAPI , nextLocationsURL, prevLocationsURL } = State;

  rl.on("line", async (input: string) =>{
    const words = cleanInput(input);

    if (words.length === 0) {
      rl.prompt();
      return;
    }

    const commandName = words[0];
    const command = commands[commandName];
    const state: State = { commands, rl, pokeAPI, nextLocationsURL, prevLocationsURL};

    if (command) {
     try {
      await command.callback(state); 
    } catch (err) {
      console.error("Error running command:", err);
    }
    } else {
      console.log(`Unknown command: ${commandName}`);
    }

    rl.prompt();
  });
}
