import { useEffect, useState, type ReactNode } from "react";

type Sighting = {
  id: string;
  species: string;
  count: number;
  location: string;
  favorite: boolean;
};

interface BirdListProps {
  title?: ReactNode;
  initialSightings: readonly Sighting[];
  onSelect?(sighting: Sighting): void;
}

const emptyMessage = (
  <p className="empty-state" role="status">
    No birds spotted yet. <strong>Keep looking!</strong>
  </p>
);

export function BirdList({
  title = "Recent sightings",
  initialSightings,
  onSelect,
}: BirdListProps) {
  const [query, setQuery] = useState("");
  const [sightings, setSightings] = useState(initialSightings);

  useEffect(() => {
    document.title = `${sightings.length} bird sightings`;
  }, [sightings.length]);

  const visibleSightings = sightings.filter(({ species }) =>
    species.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()),
  );

  function toggleFavorite(id: string) {
    setSightings((current) =>
      current.map((sighting) =>
        sighting.id === id
          ? { ...sighting, favorite: !sighting.favorite }
          : sighting,
      ),
    );
  }

  return (
    <section aria-labelledby="bird-list-title">
      <header>
        <h2 id="bird-list-title">{title}</h2>
        <label>
          Filter species
          <input
            type="search"
            value={query}
            placeholder="Try 'Bullfinch'"
            onChange={(event) => setQuery(event.currentTarget.value)}
          />
        </label>
      </header>

      {visibleSightings.length === 0 ? (
        emptyMessage
      ) : (
        <ul className="bird-grid">
          {visibleSightings.map((sighting) => (
            <li key={sighting.id} data-favorite={sighting.favorite || undefined}>
              <button type="button" onClick={() => onSelect?.(sighting)}>
                <span>{sighting.species}</span>
                <small>
                  {sighting.count} at {sighting.location}
                </small>
              </button>
              <button
                type="button"
                aria-label={`Favorite ${sighting.species}`}
                onClick={() => toggleFavorite(sighting.id)}
              >
                {sighting.favorite ? "Saved" : "Save"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
