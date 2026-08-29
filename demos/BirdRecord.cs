using System;
using System.Collections.Generic;
using System.Linq;

namespace Garden.Birds;

public enum Habitat { Garden, Woodland, Wetland }

public sealed record Sighting(string Species, int Count, Habitat Habitat, DateTimeOffset SeenAt)
{
    public string Label => $"{Count} {Species} in the {Habitat.ToString().ToLowerInvariant()}";
}

public static class BirdReport
{
    public static IReadOnlyDictionary<Habitat, int> Summarize(IEnumerable<Sighting> sightings) =>
        sightings.GroupBy(sighting => sighting.Habitat)
            .ToDictionary(group => group.Key, group => group.Sum(sighting => sighting.Count));

    public static void Main()
    {
        var sightings = new[] { new Sighting("Bullfinch", 2, Habitat.Garden, DateTimeOffset.UtcNow) };
        Console.WriteLine(string.Join(", ", Summarize(sightings).Select(pair => $"{pair.Key}: {pair.Value}")));
    }
}
