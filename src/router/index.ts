import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'
import ParentDashboard from '../components/Parent/Dashboard.vue'
import DriverDashboard from '../components/Driver/Dashboard.vue'

const routes = [
  { path: '/', component: Login },
  { path: '/parent', component: ParentDashboard, meta: { requiresAuth: true } },
  { path: '/driver', component: DriverDashboard, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('token')
  console.log("Route change:", from.path, "->", to.path, "| Logged in:", isLoggedIn)

  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/')
  } else {
    next()
  }
})

export default router