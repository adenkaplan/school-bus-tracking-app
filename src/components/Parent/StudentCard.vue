<template>
  <v-card class="mx-auto my-4" max-width="344">
    <v-card-item>
      <v-avatar size="80" class="mb-2">
        <v-img :src="student.picture" :alt="student.name"></v-img>
      </v-avatar>
      <v-card-title>{{ student.name }}</v-card-title>
    </v-card-item>

    <v-card-text>
      <div>{{ student.details }}</div>
    </v-card-text>

    <v-card-actions>
      <v-btn color="primary" @click="handlePickUp">
        Pick Up
      </v-btn>
      <v-btn color="secondary" @click="handleDropOff">
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
  }
}>();

const emit = defineEmits(['notification']);

const handlePickUp = () => {
  emit('notification', {
    type: 'pickup',
    studentId: props.student.id,
    message: `${props.student.name} is ready for pick up.`
  });
};

const handleDropOff = () => {
  emit('notification', {
    type: 'dropoff',
    studentId: props.student.id,
    message: `${props.student.name} has been dropped off.`
  });
};
</script>