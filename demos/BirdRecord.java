import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public final class BirdRecord {
  enum Habitat { GARDEN, WOODLAND, WETLAND }

  record Sighting(String species, int count, Habitat habitat, Instant seenAt) {
    String label() {
      return "%d %s in %s".formatted(count, species, habitat.name().toLowerCase());
    }
  }

  static Map<Habitat, Integer> summarize(List<Sighting> sightings) {
    return sightings.stream().collect(Collectors.groupingBy(
        Sighting::habitat,
        Collectors.summingInt(Sighting::count)
    ));
  }

  public static void main(String[] args) {
    var sightings = List.of(new Sighting("Bullfinch", 2, Habitat.GARDEN, Instant.now()));
    summarize(sightings).forEach((habitat, count) -> System.out.println(habitat + ": " + count));
  }
}
