"""Create a small report from bird sightings."""

from __future__ import annotations

import asyncio
from collections.abc import AsyncIterator, Iterable
from dataclasses import dataclass, field
from datetime import UTC, datetime
from enum import StrEnum
from pathlib import Path
import json


class Habitat(StrEnum):
    GARDEN = "garden"
    WETLAND = "wetland"
    WOODLAND = "woodland"


@dataclass(frozen=True, slots=True)
class Sighting:
    species: str
    count: int
    habitat: Habitat
    observed_at: datetime = field(default_factory=lambda: datetime.now(UTC))
    notes: str | None = None

    @property
    def label(self) -> str:
        suffix = "bird" if self.count == 1 else "birds"
        return f"{self.species}: {self.count} {suffix}"


def summarize(sightings: Iterable[Sighting]) -> dict[Habitat, int]:
    totals = {habitat: 0 for habitat in Habitat}
    for sighting in sightings:
        if sighting.count < 0:
            raise ValueError(f"Count cannot be negative: {sighting.count}")
        totals[sighting.habitat] += sighting.count
    return totals


async def read_sightings(path: Path) -> AsyncIterator[Sighting]:
    raw_records = await asyncio.to_thread(path.read_text, encoding="utf-8")
    for record in json.loads(raw_records):
        match record:
            case {
                "species": str(species),
                "count": int(count),
                "habitat": str(habitat),
            }:
                yield Sighting(species, count, Habitat(habitat))
            case _:
                raise TypeError(f"Invalid sighting: {record!r}")


async def main() -> None:
    sightings = [sighting async for sighting in read_sightings(Path("birds.json"))]
    print("\n".join(f"{habitat.title():<12} {count:>3}" for habitat, count in summarize(sightings).items()))


if __name__ == "__main__":
    asyncio.run(main())
