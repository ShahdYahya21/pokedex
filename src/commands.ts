import { CLICommand, State } from "./state.js";
import { Location } from "./pokeapi.js"; 

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

  };
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

  const areaName = args.join("-"); // join in case user types multiple words
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
