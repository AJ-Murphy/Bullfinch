use std::collections::BTreeMap;

#[derive(Debug, Clone, Copy, Eq, Ord, PartialEq, PartialOrd)]
enum Habitat {
    Garden,
    Woodland,
    Wetland,
}

struct Sighting<'a> {
    species: &'a str,
    count: u8,
    habitat: Habitat,
}

fn summarize(sightings: &[Sighting]) -> BTreeMap<Habitat, u32> {
    let mut totals = BTreeMap::new();
    for sighting in sightings {
        *totals.entry(sighting.habitat).or_insert(0) += u32::from(sighting.count);
    }
    totals
}

fn main() {
    let sightings = [Sighting { species: "Bullfinch", count: 2, habitat: Habitat::Garden }];
    for (habitat, count) in summarize(&sightings) {
        println!("{habitat:?}: {count}");
    }
}
