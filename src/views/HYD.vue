<script setup>
import store from '../store/index.js'
import Sidenav from '../components/Sidenav.vue'
import MainInputs from '../components/MainInputs.vue'
</script>

<template>
    <div class="d-flex">
        <Sidenav />

        <div class="main ms-4 mx-auto mt-3 d-flex flex-column justify-content-start">
            <h1>Micro Models</h1>
            <hr class="w-100">
            <h3 class="mt-4">Hydraulics Formulas</h3>
            <component :is="store.hydTab.activeTab"></component>
            
        </div>
        <div class="mt-5 border border-start border-light">
            <MainInputs />
        </div>
        
    </div>
</template>

<style scoped>
</style>