<script setup>
import DrillCollarWeight from '../components/Equations/applied_drilling_formulas/DrillCollarWeight.vue'
import Sidenav from '../components/Sidenav.vue'
import MainInputs from '../components/MainInputs.vue'
import store from '../store/index.js'
import { ref, computed } from 'vue'

const mw = ref(11.5)

// Active Components
const dcw = ref(true)

// Data
const drillCollarWeight = store.state.DCW

</script>

<template>
    <div class="d-flex">
        <Sidenav />

        <div class="main ms-4 mx-auto mt-3 d-flex flex-column justify-content-start">
            <h1>Micro Models</h1>
            <hr class="w-100">
            <h3>Applied Drilling Formulas</h3>
            <component :is="store.adfTab.activeTab"></component>
            <MainInputs />
        </div>
        
    </div>
</template>

<style scoped>
</style>