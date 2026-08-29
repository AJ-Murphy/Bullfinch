<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";

interface Bird {
  id: number;
  species: string;
  count: number;
  habitat: "garden" | "woodland" | "wetland";
}

const props = withDefaults(
  defineProps<{
    heading?: string;
    initialBirds: Bird[];
  }>(),
  { heading: "Garden visitors" },
);

const emit = defineEmits<{
  selected: [bird: Bird];
  cleared: [];
}>();

const search = ref("");
const selectedId = ref<number | null>(null);
const birds = ref([...props.initialBirds]);

const filteredBirds = computed(() => {
  const query = search.value.trim().toLowerCase();
  return birds.value.filter((bird) => bird.species.toLowerCase().includes(query));
});

const total = computed(() => birds.value.reduce((sum, bird) => sum + bird.count, 0));

function selectBird(bird: Bird): void {
  selectedId.value = bird.id;
  emit("selected", bird);
}

function clearSelection(): void {
  selectedId.value = null;
  emit("cleared");
}

watch(total, (next, previous) => {
  console.debug(`Bird count changed from ${previous} to ${next}`);
});

onMounted(() => {
  search.value = new URLSearchParams(window.location.search).get("species") ?? "";
});
</script>

<template>
  <section class="bird-counter">
    <header>
      <p class="eyebrow">Field notes</p>
      <h2>{{ heading }}</h2>
      <strong>{{ total }} birds recorded</strong>
    </header>

    <input v-model.trim="search" type="search" placeholder="Filter by species" />

    <TransitionGroup v-if="filteredBirds.length" name="birds" tag="ul">
      <li
        v-for="bird in filteredBirds"
        :key="bird.id"
        :class="{ selected: bird.id === selectedId }"
      >
        <button type="button" @click="selectBird(bird)">
          {{ bird.species }}
          <span>{{ bird.count }} - {{ bird.habitat }}</span>
        </button>
      </li>
    </TransitionGroup>

    <p v-else>No matching birds found.</p>
    <button v-show="selectedId !== null" type="button" @click="clearSelection">
      Clear selection
    </button>
  </section>
</template>

<style scoped>
.bird-counter {
  display: grid;
  gap: 1rem;
  padding: clamp(1rem, 4vw, 2.5rem);
  color: #d6deeb;
  background: #011627;
  border: 1px solid #5f7e97;
}

.eyebrow,
li span {
  color: #7fdbca;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

li.selected {
  outline: 2px solid #c792ea;
}

.birds-enter-active,
.birds-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}
</style>
