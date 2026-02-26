import { CLICommand, State } from "./state.js";

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
    }

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




