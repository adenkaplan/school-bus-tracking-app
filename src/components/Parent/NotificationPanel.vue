<template>
  <v-sheet class="pa-4">
    <h2 class="text-h5 mb-4">Notifications</h2>
    <v-list>
      <v-list-item v-for="notification in notifications" :key="notification.id">
        <v-list-item-title>{{ notification.message }}</v-list-item-title>
        <v-list-item-subtitle>{{ formatTime(notification.timestamp) }}</v-list-item-subtitle>
      </v-list-item>
    </v-list>
  </v-sheet>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps<{
  notifications: Array<{
    id: string;
    message: string;
    timestamp: number;
  }>
}>();

const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString();
};
</script>