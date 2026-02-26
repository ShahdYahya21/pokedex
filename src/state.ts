
import readline from "node:readline";
import { createInterface } from "node:readline";
import { getCommands } from "./commands.js";
import { PokeAPI } from "./pokeapi.js";

export type State = {
  commands: Record<string, CLICommand>;
  rl: readline.Interface;
  pokeAPI: PokeAPI;
  nextLocationsURL?: string;
  prevLocationsURL?: string;
}

export type CLICommand = {
  name: string;
  description: string;
 callback: (state: State, ...args: string[]) => Promise<void>;
};


export function initState(): State {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "Pokedex > ",
  });

  const commands = getCommands();
  
  const pokeAPI = new PokeAPI(); 

  const nextLocationsURL = undefined; 
  const prevLocationsURL = undefined;


  return { rl, commands, pokeAPI, nextLocationsURL, prevLocationsURL };
}
