import { CLICommand, State } from "./state.js";
import { Location } from "./pokeapi.js"; 
import { inspect } from "node:util";
import { a } from "vitest/dist/chunks/suite.d.BJWk38HB.js";

export function getCommands(): Record<string, CLICommand> {
  return {
    exit: {
      name: "exit",
      description: "Exits the Pokedex",
      callback: commandExit,
    },
     help: {
      name: "help",
      description: "Displays a help message",
      callback: commandHelp,
    },
    map : {
        name: "map",
        description: "Displays the map of the current location",
        callback: commandMap,
    },
    mapb : {
        name: "mapb",
        description: "Displays the map of the previous location",
        callback: commandMapb,
    },
    explore : {
        name: "explore",
        description: "Explore the current location",
        callback: commandExplore,
    },
    catch : {
        name: "catch",
        description: "Catch a Pokemon in the current location (not implemented yet)",
        callback: commandCatch,
    },
    inspect : {
        name: "inspect",
        description: "Inspect a caught Pokemon in your Pokedex",
        callback : commandInspect,
  },
  pokedex : {
    name: "pokedex",
    description: "List all caught Pokemon in your Pokedex",
    callback : commandPokedex,
},
}
}



export async function commandExit(state : State) : Promise<void> {
 console.log("Closing the Pokedex... Goodbye!");
  state.rl.close(); 
  process.exit(0);  
}





export async function commandHelp(state : State) : Promise<void> {
   console.log("Welcome to the Pokedex!");
  console.log("Usage:\n");

  for (const cmdName in state.commands) {
    const cmd = state.commands[cmdName];
    console.log(`${cmd.name}: ${cmd.description}`);
}
}



export async function commandMap(state : State) : Promise<void> {
    try {
        const locations = await state.pokeAPI.fetchLocations(state.nextLocationsURL);

    for (const location of locations.results) {
      console.log(location.name);
    }

    state.nextLocationsURL = locations.next;
    state.prevLocationsURL = locations.previous;

    }catch (err) {
        console.error("Error fetching locations:", err);
    }
}



export async function commandMapb(state : State) : Promise<void> {
    try {
        const locations = await state.pokeAPI.fetchLocations(state.prevLocationsURL);

    for (const location of locations.results) {
      console.log(location.name);
    }

    state.nextLocationsURL = locations.next;
    state.prevLocationsURL = locations.previous;

    }catch (err) {
        console.error("Error fetching locations:", err);
    }
}




export async function commandExplore(state: State, ...args: string[]): Promise<void> {
  if (args.length === 0) {
    console.log("Usage: explore <location-area-name>");
    return;
  }

  const areaName = args.join("-"); 
  console.log(`Exploring ${areaName}...`);

  try {
    // Use the cached PokeAPI fetch
    const location: Location = await state.pokeAPI.fetchLocation(areaName);

    if (!location || !location.pokemon_encounters) {
      console.log("No Pokémon found in this area.");
      return;
    }

    console.log("Found Pokemon:");
    location.pokemon_encounters.forEach((encounter) => {
      console.log(" -", encounter.pokemon.name);
    });
  } catch (err) {
    console.error("Failed to explore location:", err);
  }
}





export async function commandCatch(
  state: State,
  ...args: string[]
): Promise<void> {
  if (args.length === 0) {
    console.log("Usage: catch <pokemon-name>");
    return;
  }

  const name = args[0].toLowerCase();

  console.log(`Throwing a Pokeball at ${name}...`);

  try {
    const pokemon = await state.pokeAPI.catchPokemon(name);

    // Catch chance logic
    // Higher base_experience = harder to catch
    const difficulty = pokemon.base_experience;
    const catchChance = Math.max(0.1, 1 - difficulty / 500);

    const roll = Math.random();

    if (roll < catchChance) {
      console.log(`${name} was caught!`);
      state.pokedex[name] = pokemon;
    } else {
      console.log(`${name} escaped!`);
    }

  } catch (err) {
    console.error("Failed to catch pokemon:", err);
  }
}


export async function commandInspect(
  state: State,
  ...args: string[]
): Promise<void> {
  if (args.length === 0) {
    console.log("Usage: inspect <pokemon-name>");
    return;
  }

  const name = args[0].toLowerCase();
  const pokemon = state.pokedex[name];

  if (!pokemon) {
    console.log("You have not caught that Pokémon");
    return;
  }

  console.log(`Name: ${pokemon.name}`);
  console.log(`Height: ${pokemon.height}`);
  console.log(`Weight: ${pokemon.weight}`);

  console.log("Stats:");
  pokemon.stats.forEach((stat) => {
    console.log(`  -${stat.stat.name}: ${stat.base_stat}`);
  });

  console.log("Types:");
  pokemon.types.forEach((type) => {
    console.log(`  - ${type.type.name}`);
  });
}

async function commandPokedex(state: State) {
    const caughtPokemon = Object.values(state.pokedex);
        if (caughtPokemon.length === 0) {
        console.log("Your Pokedex is empty. Catch some Pokemon first!");
        return;
    }

    console.log("Your Pokedex:");

    for (const pokemon of caughtPokemon) {
        console.log(`- ${pokemon.name} (ID: ${pokemon.id})`);
    }


}