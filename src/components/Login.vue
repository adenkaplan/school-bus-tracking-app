<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Login</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="login">
              <v-text-field
                v-model="username"
                label="Username"
                name="username"
                prepend-icon="mdi-account"
                type="text"
                required
                outlined
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="Password"
                name="password"
                prepend-icon="mdi-lock"
                type="password"
                required
                outlined
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="login">Login</v-btn>
          </v-card-actions>
        </v-card>
        <v-alert v-if="showDummyCredentials" type="info" class="mt-4">
          <strong>Dummy Credentials:</strong><br>
          Parent: username: parent, password: parent123<br>
          Driver: username: driver, password: driver123
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')
const showDummyCredentials = ref(true)

const login = () => {
  console.log("Login attempt:", username.value, password.value)
  let role = ''
  if (username.value === 'parent' && password.value === 'parent123') {
    role = 'parent'
  } else if (username.value === 'driver' && password.value === 'driver123') {
    role = 'driver'
  } else {
    alert('Invalid credentials')
    return
  }

  // Simulate JWT token creation with role
  const token = btoa(JSON.stringify({ username: username.value, role }))
  localStorage.setItem('token', token)
  console.log("Login successful, role:", role)

  router.push(`/${role}`)
}
</script>