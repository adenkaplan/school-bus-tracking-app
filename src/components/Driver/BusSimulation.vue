<template>
  <v-card class="mb-4">
    <v-card-title>Bus Simulation</v-card-title>
    <v-card-text>
      <v-slider
        v-model="simulationSpeed"
        :min="1"
        :max="10"
        step="1"
        label="Simulation Speed"
        thumb-label
      ></v-slider>
      <v-btn
        :color="isSimulating ? 'error' : 'success'"
        @click="toggleSimulation"
      >
        {{ isSimulating ? 'Stop' : 'Start' }} Simulation
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  isSimulating: boolean
}>()

const simulationSpeed = ref(5);
const isSimulating = ref(props.isSimulating);

const emit = defineEmits(['start-simulation', 'stop-simulation']);

watch(() => props.isSimulating, (newValue) => {
  isSimulating.value = newValue;
});

const toggleSimulation = () => {
  if (isSimulating.value) {
    emit('stop-simulation');
  } else {
    emit('start-simulation', simulationSpeed.value);
  }
};
</script>