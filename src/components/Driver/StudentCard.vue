<template>
  <v-card class="mx-auto my-4" max-width="344">
    <v-card-item>
      <v-avatar size="40" class="mr-4">
        <v-img :src="student.picture" :alt="student.name"></v-img>
      </v-avatar>
      <v-card-title>{{ student.name }}</v-card-title>
    </v-card-item>

    <v-card-text>
      <div>{{ student.details }}</div>
      <div>Status: {{ student.status }}</div>
    </v-card-text>

    <v-card-actions>
      <v-btn color="primary" @click="handlePickUp" :disabled="student.status === 'Picked Up'">
        Pick Up
      </v-btn>
      <v-btn color="secondary" @click="handleDropOff" :disabled="student.status === 'Dropped Off'">
        Drop Off
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{
  student: {
    id: string;
    name: string;
    picture: string;
    details: string;
    status: string;
  }
}>();

const emit = defineEmits(['pick-up', 'drop-off']);

const handlePickUp = () => {
  emit('pick-up', props.student.id);
};

const handleDropOff = () => {
  emit('drop-off', props.student.id);
};
</script>