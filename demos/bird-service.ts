import { readFile } from "node:fs/promises";

export type Habitat = "woodland" | "wetland" | "garden";

export interface BirdSighting {
  readonly id: string;
  species: string;
  count: number;
  habitat: Habitat;
  observedAt: Date;
  notes?: string;
}

const SPECIES_PATTERN = /^[A-Z][a-z]+(?: [a-z]+)+$/;
const DEFAULT_LIMIT = 25;

export class SightingRepository<T extends BirdSighting> {
  #sightings = new Map<string, T>();

  add(sighting: T): void {
    if (!SPECIES_PATTERN.test(sighting.species)) {
      throw new TypeError(`Invalid species name: ${sighting.species}`);
    }

    this.#sightings.set(sighting.id, sighting);
  }

  findByHabitat(habitat: Habitat, limit = DEFAULT_LIMIT): readonly T[] {
    return [...this.#sightings.values()]
      .filter((sighting) => sighting.habitat === habitat)
      .sort((left, right) => right.observedAt.getTime() - left.observedAt.getTime())
      .slice(0, limit);
  }

  get totalBirds(): number {
    return [...this.#sightings.values()].reduce(
      (total, { count }) => total + count,
      0,
    );
  }
}

export async function loadSightings(
  path: URL,
): Promise<SightingRepository<BirdSighting>> {
  const contents = await readFile(path, "utf8");
  const records: unknown = JSON.parse(contents);

  if (!Array.isArray(records)) {
    throw new Error("Expected an array of sightings");
  }

  const repository = new SightingRepository<BirdSighting>();

  for (const record of records as Array<Omit<BirdSighting, "observedAt"> & {
    observedAt: string;
  }>) {
    repository.add({ ...record, observedAt: new Date(record.observedAt) });
  }

  return repository;
}

const status = { online: true, retries: 0 } satisfies Record<string, unknown>;
console.info("Sighting service ready", status);
