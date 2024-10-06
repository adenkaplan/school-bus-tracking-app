import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { initDB } from './utils/db'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

// Leaflet styles
import 'leaflet/dist/leaflet.css'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'

const vuetify = createVuetify({
  components,
  directives,
})

initDB().then(() => {
  createApp(App)
    .use(router)
    .use(vuetify)
    .mount('#app')
})