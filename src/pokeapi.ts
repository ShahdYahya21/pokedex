import { Cache } from "./pokecache.js";

export class PokeAPI {
  private static readonly baseURL = "https://pokeapi.co/api/v2";
  readonly #cache = new Cache(1000 * 60 * 5);

  constructor() {}

  async fetchLocations(pageURL?: string): Promise<ShallowLocations> {
    const url = pageURL || `${PokeAPI.baseURL}/location-area?limit=20`;

    const cachedData = this.#cache.get(url);
    if (cachedData) {
      return cachedData as ShallowLocations;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch locations: ${response.statusText}`);
    }

    const data = await response.json();
    this.#cache.add(url, data);
    return data;


  }

  

  async catchPokemon(pokemonName: string): Promise<Pokemon> {
    const url = `${PokeAPI.baseURL}/pokemon/${pokemonName}`;
    const cachedData = this.#cache.get(url);
    if (cachedData) {
      return cachedData as Pokemon;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon ${pokemonName}: ${response.statusText}`);
    }

    const data = await response.json();
    this.#cache.add(url, data);
    return data;
  }

  async fetchLocation(locationName: string): Promise<Location> {
    const url = `${PokeAPI.baseURL}/location-area/${locationName}`;
    const cachedData = this.#cache.get(url);
    if (cachedData) {
      return cachedData as Location;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch location ${locationName}: ${response.statusText}`);
    }

    const data = await response.json();
    this.#cache.add(url, data);
    return data;
  }
}




export type ShallowLocations = {
  count: number;
  next?: string;
  previous?: string;
  results: { name: string; url: string }[];
};

export type Location = {
  id: number;
  name: string;
  region: { name: string; url: string };
  game_indices: { game_index: number; version: { name: string; url: string } }[];
  names: { name: string; language: { name: string } }[];

  pokemon_encounters: {
    pokemon: { name: string; url: string };
    version_details: {
      max_chance: number;
      encounter_details: any[]; 
      version: { name: string; url: string };
    }[];
  }[];
};

export type Pokemon = {
    id: number;
    name: string;
    base_experience: number;
    height: number;
    weight: number;
    stats: PokemonStat[];      
    types: PokemonType[];  

}

export type PokemonStat = {
  base_stat: number;
  effort: number;
  stat: { name: string; url: string };
};

export type PokemonType = {
  slot: number;
  type: { name: string; url: string };
};

