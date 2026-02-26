

export type CacheEntry<T> = {
  createdAt: number; 
  val: T;           
};

export class Cache {
  #cache = new Map<string, CacheEntry<any>>();
  #reapIntervalId : NodeJS.Timeout | undefined = undefined;
  #interval: number; 

    constructor(interval: number) {
      this.#interval = interval;
      this.#startReapLoop();
    }

  add<T>(key: string, value: T): void {
    const entry: CacheEntry<T> = {
      createdAt: Date.now(),
      val: value,
    };
    this.#cache.set(key, entry);
  }
 get<T>(key: string): T | undefined {
  const entry = this.#cache.get(key);
  if (!entry) return undefined;

  if (Date.now() - entry.createdAt > this.#interval) {
    this.#cache.delete(key);
    console.log(`[Cache expired] ${key}`);
    return undefined;
  }

  console.log(`[Cache hit] ${key}`);
  return entry.val;
}
  #reap(){
    const now = Date.now();
    for (const [key, entry] of this.#cache.entries()) {
      if (entry.createdAt < now - this.#interval) {
        this.#cache.delete(key);
      }
    }
  }
  #startReapLoop(){
    if (this.#reapIntervalId) {
      return; 
    }
    this.#reapIntervalId = setInterval(() => {
      this.#reap();
    }, this.#interval);     

  }

  stopReapLoop(){
    if (this.#reapIntervalId) {
      clearInterval(this.#reapIntervalId);
      this.#reapIntervalId = undefined;
    }
  }

}
