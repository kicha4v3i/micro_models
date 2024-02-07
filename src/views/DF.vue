<script setup> 
import Sidenav from '../components/Sidenav.vue'
import MainInputs from '../components/MainInputs.vue'
import store from '../store/index.js'
import router from '@/router'

// Redirect to login page if not logged in
const user = store.state.user;

if (!user) {
    router.push({name: 'login'})
}

// Sidenav Collapse status
const collapse_stat = store.sidenav_collapse
</script>
<template>
    <div class="d-flex">
        <div>
            <Sidenav />
        </div>
        

        <div class="main ms-4 mx-auto mt-3 d-flex flex-column justify-content-start" :class="{side_collapse: collapse_stat}">
            <h1>Micro Models</h1>
            <hr class="w-100">
            <h3>Drilling Fluid Formulas <span v-if="store.dfTab.activeTab">{{ '- ' + store.dfTab.tabName }}</span></h3>
            <component :is="store.dfTab.activeTab"></component>
            
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
