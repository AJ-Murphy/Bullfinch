defmodule BirdTracker do
  @type sighting :: %{species: String.t(), count: pos_integer(), habitat: atom()}

  def summarize(sightings) do
    Enum.reduce(sightings, %{}, fn %{habitat: habitat, count: count}, totals ->
      Map.update(totals, habitat, count, &(&1 + count))
    end)
  end

  def label(%{species: species, count: count, habitat: habitat}) do
    "#{count} #{species} in the #{habitat}"
  end
end

BirdTracker.summarize([%{species: "Bullfinch", count: 2, habitat: :garden}])
