<script setup>
import { ref, computed } from 'vue'
import store from '/Users/risingphoenix/Documents/iDT/Softwares/Micro Models/prototype/micro_models_3/src/store/index.js'

// Data
const K = ref('')

// Calculations
const cci = computed(() => {
    let qBaseUnit
    let odBaseUnit
    let idBaseUnit
    let mwBaseUnit

    if (store.inputUnits.flowrateUnit == 'lpm') {
        qBaseUnit = store.mainInputs.flowrate / 3.7854
    } else {
        qBaseUnit = store.mainInputs.flowrate
    }

    if (store.bitSizeUnit == 'mm') {
        odBaseUnit = store.mainInputs.bitSize / 1000 * 3.281 * 12
    } else {
        odBaseUnit = store.mainInputs.bitSize
    }

    if (store.pipeIDUnit == 'mm') {
        idBaseUnit = store.mainInputs.pipeOD / 1000 * 3.281 * 12
    } else {
        idBaseUnit = store.mainInputs.pipeOD
    }

    if (store.mwUnit == 'g/cc') {
        mwBaseUnit = store.mainInputs.mw * 8.33
    } else {
        mwBaseUnit = store.mainInputs.mw
    }
   
    // Annular Velocity
    const av = 24.51 * qBaseUnit / (odBaseUnit * odBaseUnit - idBaseUnit * idBaseUnit)

    return (K.value * av * mwBaseUnit / 400000).toFixed(2)

})

</script>

<template>
    <div class="d-flex justify-content-between align-items-start">
        <div class="data-show d-flex ms-5 mt-5 align-items-center">
            <div class="inputs">
                <h3 class="fs-5 ms-5">Cuttings Carrying Index</h3>

                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                            <input class="form-control" type="number" min="0" id="K" step="0.1" placeholder="consistency_index" v-model="K">
                            <label for="K" class="form-label">Consistency Index</label>
                    </div>
                    <span class="align-baseline text-secondary fs-6 ms-3">eq. cP</span>
     
                </div>
            </div>

            <div class="outputs ms-5">
                <div class="lp-height d-flex align-items-end">
                    <div class="lp-height-out">
                        <span class="text-secondary text-uppercase fs-6">Cuttings Carrying Index</span>
                        <h3 class="text-center text-success">{{ cci }}</h3>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>