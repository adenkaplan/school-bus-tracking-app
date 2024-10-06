<template>
  <v-container>
    <h1>Parent Dashboard</h1>
    <v-row>
      <v-col cols="12" md="8">
        <div id="map" style="height: 400px; width: 100%;"></div>
      </v-col>
      <v-col cols="12" md="4">
        <NotificationPanel :notifications="notifications" />
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="student in students" :key="student.id" cols="12" sm="6" md="4">
        <StudentCard :student="student" @notification="addNotification" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-routing-machine'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import { getAll, get } from '../../utils/db'
import StudentCard from './StudentCard.vue'
import NotificationPanel from './NotificationPanel.vue'

const students = ref([])
const currentRoute = ref({ stops: [] })
const busLocation = ref({ lat: 0, lng: 0 })
const notifications = ref([])
let map: L.Map
let busMarker: L.Marker
let routingControl: L.Routing.Control

onMounted(async () => {
  await Promise.all([
    getStudents(),
    getRoute(),
    getBusLocation()
  ])
  initMap()
  const intervalId = setInterval(updateBusLocation, 10000)
  onUnmounted(() => clearInterval(intervalId))
})

async function getStudents() {
  students.value = await getAll('students')
}

async function getRoute() {
  currentRoute.value = await get('routes', '1')
}

async function getBusLocation() {
  const depotStop = currentRoute.value.stops?.find(stop => stop.type === 'depot')
  if (depotStop) {
    busLocation.value = { lat: depotStop.lat, lng: depotStop.lng }
  }
}

async function updateBusLocation() {
  await getBusLocation()
  if (busMarker && busLocation.value.lat && busLocation.value.lng) {
    busMarker.setLatLng([busLocation.value.lat, busLocation.value.lng])
  }
}

function initMap() {
  if (!busLocation.value.lat || !busLocation.value.lng) return

  map = L.map('map').setView([busLocation.value.lat, busLocation.value.lng], 13)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map)

  busMarker = L.marker([busLocation.value.lat, busLocation.value.lng]).addTo(map)

  const waypoints = currentRoute.value.stops?.map((stop: any) => L.latLng(stop.lat, stop.lng)) || []

  if (waypoints.length > 1) {
    routingControl = L.Routing.control({
      waypoints: waypoints,
      routeWhileDragging: false,
      addWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false
    }).addTo(map)
  }
}

function addNotification(notification) {
  notifications.value.unshift({
    id: Date.now().toString(),
    message: notification.message,
    timestamp: Date.now()
  })
}
</script>