<script setup>
import store from '../store/index.js'
import Sidenav from '../components/Sidenav.vue'
import MainInputs from '../components/MainInputs.vue'
import router from '@/router'
import { ref } from 'vue'

// Redirect to login page if not logged in
const user = store.state.user;

if (!user) {
    router.push({name: 'login'})
}

// Current Tab
const currentTab = ref('')
if (store.hydTab.activeTab) {
    currentTab.value = store.hydTab.activeTab
}

// Sidenav Collapse status
const collapse_stat = store.sidenav_collapse

</script>

<template>
    <div class="d-flex w-100">
        <div>
            <Sidenav />
        </div>
        

        <div class="main ms-4 mx-auto mt-3 d-flex flex-column justify-content-start" :class="{side_collapse: collapse_stat}">
            <h1 class="w-100">Micro Models</h1>
            <hr class="w-100">
            <h3 class="mt-4">Hydraulics Formulas <span v-if="store.hydTab.activeTab">{{ '- ' + store.hydTab.tabName }}</span></h3>
            <component :is="store.hydTab.activeTab"></component>
            
        </div>
        
        <div class="mt-5 border border-start border-light">
            <MainInputs />
        </div>
        
        
    </div>
</template>

<style scoped>
.main {
    width: 55vw;
    transition: ease-out 0.3s;
}

.side_collapse {
    width: 67vw;
}
</style>
