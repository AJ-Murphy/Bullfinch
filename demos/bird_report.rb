Sighting = Data.define(:species, :count, :habitat) do
  def label
    "#{count} #{species} in the #{habitat}"
  end
end

sightings = [
  Sighting.new("Bullfinch", 2, :garden),
  Sighting.new("Blue Tit", 4, :garden)
]

totals = sightings.group_by(&:habitat).transform_values { |birds| birds.sum(&:count) }
totals.each { |habitat, count| puts "#{habitat}: #{count}" }
