#!/usr/bin/env bash
set -euo pipefail

declare -A totals=([garden]=0 [woodland]=0)
sightings=("Bullfinch:garden:2" "Blue Tit:garden:4")

for sighting in "${sightings[@]}"; do
  IFS=: read -r species habitat count <<< "$sighting"
  totals["$habitat"]=$((totals["$habitat"] + count))
  printf '%s: %d\n' "$species" "$count"
done

for habitat in "${!totals[@]}"; do
  printf '%s total: %d\n' "$habitat" "${totals[$habitat]}"
done
