WITH recent_sightings AS (
  SELECT species, habitat, count, observed_at
  FROM sightings
  WHERE observed_at >= CURRENT_DATE - INTERVAL '7 days'
)
SELECT
  habitat,
  COUNT(*) AS visits,
  SUM(count) AS birds_seen,
  STRING_AGG(DISTINCT species, ', ' ORDER BY species) AS species
FROM recent_sightings
GROUP BY habitat
HAVING SUM(count) > 0
ORDER BY birds_seen DESC;
