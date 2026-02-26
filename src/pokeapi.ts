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

  

  async fetchLocation(locationName: string): Promise<Location> {
    const url = `${PokeAPI.baseURL}/location-area/${locationName}`;
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
};