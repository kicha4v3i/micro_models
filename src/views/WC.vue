<script setup>
import store from '../store/index.js'
import Sidenav from '../components/Sidenav.vue'
import MainInputs from '../components/MainInputs.vue'
</script>

<template>
    <div class="d-flex">
        <Sidenav />

        
        <div class="main ms-5 mx-auto mt-5 d-flex flex-column justify-content-start">
            <h3>Well Control Formulas</h3>
            <component :is="store.wcTab.activeTab"></component>
            <MainInputs />
        </div>
        
    </div>
</template>