<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue'
import { supabase } from './lib/supabaseClient.js'
import store from './store/index.js'
import Navigation from './components/Navigation.vue'


// Data
const appReady = ref(true)

// Check if user is already logged in
const user = supabase.auth.getUser()

// If user does not exist, make app ready
if (!user) {
  appReady.value = true
}

// Runs when auth state has changed when user has logged in 
supabase.auth.onAuthStateChange((_, session) => {
  store.methods.setUser(session)
  appReady.value = true
})

</script>

<template>
  <div v-if="appReady">
    <div v-if="store.state.user">
      <Navigation />
    </div>
    
    <RouterView />
  </div>
  
</template>

<style scoped>
* {
  font-family: 'Montserrat', sans-serif;
}
</style>
