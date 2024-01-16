<script setup>
import store from '../store/index.js'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabaseClient.js'

// Data
const errorMsg = ref(null)

// Get User
const user = computed(() => store.state.user)

// Ref to router
const router = useRouter()


//Logout function
const logout = async () => {
    await supabase.auth.signOut()
    router.push({name: 'login'})
    localStorage.clear()
}  

    
</script>

<template>
    <div>
        <nav class="navbar navbar-expand-lg">
            <div class="container-fluid">
                <div>
                    <a class="navbar-brand" href="#">MModels</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#MMnavbar" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>
                </div>
                <div>
                    <div class="collapse navbar-collapse" id="MMnavbar">
                        <ul class="navbar-nav me-auto">
                            <li class="nav-item ms-2">
                                <router-link class="nav-link" :to="{name:'home'}">Home</router-link>
                            </li>
                            <li class="nav-item ms-2">
                                <router-link v-if="!user" class="nav-link" aria-current="page" :to="{name:'login'}">Login</router-link>
                            </li>
                            <li class="nav-item ms-2">
                                <router-link v-if="!user" class="nav-link" aria-current="page" :to="{name:'register'}">Register</router-link>
                            </li>
                            <li class="nav-item ms-2">
                                <a @click="logout" class="nav-link">Logout</a>
                            </li>
                        </ul>
                    </div>
                </div>
                
            </div>
        </nav>
    </div>
</template>

<style scoped>
nav {
    background-color: rgb(13, 141, 176);
    color: white;
}
nav a {
    color: white
}

nav a:hover {
    cursor: pointer;
    color: white;
    font-weight: 500;
}
</style>