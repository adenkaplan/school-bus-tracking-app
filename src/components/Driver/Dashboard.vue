<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-routing-machine'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import { getAll, get, update } from '../../utils/db'
import BusSimulation from './BusSimulation.vue'
import StudentCard from './StudentCard.vue'
import './Dashboard.css'

const students = ref([])
const currentRoute = ref({ stops: [] })
const busLocation = ref({ lat: 0, lng: 0 })
let map: L.Map | null = null
let busMarker: L.Marker | null = null
let routingControl: L.Routing.Control | null = null
const isSimulating = ref(false)

onMounted(async () => {
  console.log("Dashboard mounted")
  try {
    await initializeDashboard()
  } catch (error) {
    console.error("Error initializing dashboard:", error)
    // Handle the error, maybe show an error message to the user
  }
})

async function initializeDashboard() {
  try {
    await getStudents()
    await getRoute()
    await getBusLocation()
    
    console.log("Data fetched successfully")
    console.log("Students:", students.value)
    console.log("Current Route:", currentRoute.value)
    console.log("Bus Location:", busLocation.value)
    
    await nextTick()
    initMap()
  } catch (error) {
    console.error("Error in initializeDashboard:", error)
    throw error
  }
}

async function getStudents() {
  try {
    students.value = await getAll('students')
    if (!students.value || students.value.length === 0) {
      throw new Error("No students data found")
    }
  } catch (error) {
    console.error("Error fetching students:", error)
    throw error
  }
}

async function getRoute() {
  try {
    const route = await get('routes', '1')
    if (!route || !route.stops) {
      throw new Error("Invalid route data")
    }
    currentRoute.value = route
  } catch (error) {
    console.error("Error fetching route:", error)
    throw error
  }
}

async function getBusLocation() {
  try {
    const depotStop = currentRoute.value.stops?.find(stop => stop.type === 'depot')
    if (!depotStop || !depotStop.lat || !depotStop.lng) {
      throw new Error("Invalid bus location data")
    }
    busLocation.value = { lat: depotStop.lat, lng: depotStop.lng }
  } catch (error) {
    console.error("Error getting bus location:", error)
    throw error
  }
}

function initMap() {
  if (!busLocation.value.lat || !busLocation.value.lng) {
    console.error("Invalid bus location for map initialization:", busLocation.value)
    return
  }

  const mapContainer = document.getElementById('map')
  if (!mapContainer) {
    console.error("Map container not found")
    return
  }

  map = L.map('map').setView([busLocation.value.lat, busLocation.value.lng], 13)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map)

  const busIcon = L.icon({
    iconUrl: '/bus-icon.png',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  })

  busMarker = L.marker([busLocation.value.lat, busLocation.value.lng], { icon: busIcon }).addTo(map)

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

  // Add markers for students
  students.value.forEach((student: any) => {
    L.marker([student.lat, student.lng])
      .addTo(map)
      .bindPopup(student.name)
  })
}

// ... rest of the code (handlePickUp, handleDropOff, startSimulation, stopSimulation, etc.) remains the same

</script>

<template>
  <div class="driver-dashboard">
    <v-container fluid>
      <v-row>
        <v-col cols="12" md="8">
          <div id="map"></div>
          <BusSimulation
            :is-simulating="isSimulating"
            @start-simulation="startSimulation"
            @stop-simulation="stopSimulation"
          />
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-title>Route Information</v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-list>
                  <v-list-item v-for="stop in currentRoute.stops" :key="stop.id">
                    <v-list-item-avatar>
                      <v-img :src="stop.type === 'student' ? students.find(s => s.id === stop.id)?.picture : '/bus-icon.png'" />
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>{{ stop.name }}</v-list-item-title>
                      <v-list-item-subtitle>ETA: {{ stop.eta }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
        <v-col cols="12" md="4">
          <div class="student-list">
            <StudentCard
              v-for="student in students"
              :key="student.id"
              :student="student"
              @pick-up="handlePickUp"
              @drop-off="handleDropOff"
            />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>