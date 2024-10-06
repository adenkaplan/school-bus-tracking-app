<template>
  <v-app>
    <v-app-bar v-if="isLoggedIn" app color="primary" dark>
      <v-toolbar-title>Student Tracking App</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text @click="logout">
        Logout
        <v-icon right>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const isLoggedIn = ref(false)

const checkLoginStatus = () => {
  isLoggedIn.value = !!localStorage.getItem('token') && route.path !== '/'
}

const logout = () => {
  localStorage.removeItem('token')
  isLoggedIn.value = false
  router.push('/')
}

onMounted(checkLoginStatus)

watch(() => route.path, checkLoginStatus)
</script>

<style>
@import 'leaflet/dist/leaflet.css';
@import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
</style>