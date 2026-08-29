enum Habitat { Garden; Woodland; Wetland }

class Sighting {
    [string] $Species
    [int] $Count
    [Habitat] $Habitat

    Sighting([string] $species, [int] $count, [Habitat] $habitat) {
        $this.Species = $species
        $this.Count = $count
        $this.Habitat = $habitat
    }
}

$sightings = [Sighting]::new('Bullfinch', 2, [Habitat]::Garden)
$sightings | Group-Object Habitat | ForEach-Object {
    "{0}: {1}" -f $_.Name, (($_.Group | Measure-Object Count -Sum).Sum)
}
