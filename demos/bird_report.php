<?php
declare(strict_types=1);

enum Habitat: string {
    case Garden = 'garden';
    case Woodland = 'woodland';
}

final readonly class Sighting {
    public function __construct(
        public string $species,
        public int $count,
        public Habitat $habitat,
    ) {}
}

function summarize(array $sightings): array {
    $totals = [];
    foreach ($sightings as $sighting) {
        $key = $sighting->habitat->value;
        $totals[$key] = ($totals[$key] ?? 0) + $sighting->count;
    }
    return $totals;
}

print_r(summarize([new Sighting('Bullfinch', 2, Habitat::Garden)]));
