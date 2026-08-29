enum Habitat { garden, woodland, wetland }

class Sighting {
  const Sighting(this.species, this.count, this.habitat);

  final String species;
  final int count;
  final Habitat habitat;

  String get label => '$count $species in ${habitat.name}';
}

Map<Habitat, int> summarize(Iterable<Sighting> sightings) {
  final totals = <Habitat, int>{};
  for (final sighting in sightings) {
    totals.update(sighting.habitat, (count) => count + sighting.count, ifAbsent: () => sighting.count);
  }
  return totals;
}

void main() {
  final sightings = [const Sighting('Bullfinch', 2, Habitat.garden)];
  print(summarize(sightings));
}
