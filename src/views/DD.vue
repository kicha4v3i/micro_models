<script setup>
    import Sidenav from '../components/Sidenav.vue'
    import MainInputs from '../components/MainInputs.vue'
    import store from '../store/index.js'
</script>

<template>
    <div class="d-flex">
        <Sidenav />

        <div class="main ms-4 mx-auto mt-3 d-flex flex-column justify-content-start">
            <h1>Micro Models</h1>
            <hr class="w-100">
            <h3>Directional Drilling Formulas</h3>
            <component :is="store.ddTab.activeTab"></component>
            <MainInputs />
        </div>
        
    </div>
</template>
