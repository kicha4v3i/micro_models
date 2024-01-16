<script setup>
import { ref, computed } from 'vue'
import store from '/Users/risingphoenix/Documents/iDT/Softwares/Micro Models/prototype/micro_models_3/src/store/index.js'

// Data
const n = ref('')
const K = ref('')

// Units
const critQUnit = ref('gpm')

// Calculations
const critQ = computed(() => {
    // Base Units
    let qBaseUnit
    let odBaseUnit
    let idBaseUnit
    let mwBaseUnit

    if (store.flowrateUnit == 'lpm') {
        qBaseUnit = store.mainInputs.flowrateConv('gpm')
    } else {
        qBaseUnit = store.mainInputs.flowrate
    }

    if (store.bitSizeUnit == 'mm') {
        odBaseUnit = store.mainInputs.bitSizeConv('inch')
    } else {
        odBaseUnit = store.mainInputs.bitSize
    }

    if (store.pipeIDUnit == 'mm') {
        idBaseUnit = store.mainInputs.pipeODConv('inch')
    } else {
        idBaseUnit = store.mainInputs.pipeOD
    }

    if (store.mwUnit == 'g/cc') {
        mwBaseUnit = store.mainInputs.mwConv('ppg')
    } else {
        mwBaseUnit = store.mainInputs.mw
    }
    /*
    // Annular Velocity
    const av = 24.51 * qBaseUnit / (odBaseUnit * odBaseUnit - idBaseUnit * idBaseUnit)
    
    // Effective Viscosity
    const mu_e = 100 * K.value * Math.pow((144 * av / (odBaseUnit - idBaseUnit)), n.value-1)

    // Reynolds Number
    const Rea = (928 * av * (odBaseUnit - idBaseUnit) * mwBaseUnit) / (mu_e * Math.pow((2 * n.value + 1) / (3 * n.value), n.value))
    */
    // Critical Velocity
    const critVel = Math.pow(((3470 - 1370 * n.value) * 100 * K.value * Math.pow((2 * n.value + 1) / (3 * n.value), n.value) / (928 * mwBaseUnit * (odBaseUnit - idBaseUnit) * Math.pow(144 / (odBaseUnit - idBaseUnit), (1 - n.value)))), (1 / (2 - n.value)))

    // Critical Flowrate
    const critQ = 2.45 * critVel * (odBaseUnit * odBaseUnit - idBaseUnit * idBaseUnit)

    if (critQUnit.value == 'lpm') {
        return (critQ * 3.78).toFixed(0)
    } else {
        return (critQ).toFixed(0)
    }

})

</script>

<template>
    <div class="d-flex justify-content-between align-items-start">
        <div class="data-show d-flex ms-5 mt-5 align-items-center">
            <div class="inputs">
                <h3 class="fs-5 ms-5">Critical Flowrate</h3>

                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="n" step="0.01" placeholder="flow-behavior-index" v-model="n">
                        <label for="n" class="form-label">Flow Behavior Index</label>
                    </div>
                </div>

                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                            <input class="form-control" type="number" min="0" id="K" step="0.1" placeholder="consistency_index" v-model="K">
                            <label for="K" class="form-label">Consistency Index</label>
                    </div>
                    <span class="align-baseline text-secondary fs-6 ms-3"><sup>lbs</sup>/<sub>100 ft</sub><sup>2</sup> sec<sup>n</sup></span>
     
                </div>
            </div>

            <div class="outputs ms-5">
                <div class="lp-height d-flex align-items-end">
                    <div class="lp-height-out">
                        <span class="text-secondary text-uppercase fs-6">Critical Flowrate</span>
                        <h3 class="text-center text-success">{{ critQ }}</h3>
                    </div>
                    <div class="lp-height-unit">
                        <span>
                            <select class="form-select" v-model="critQUnit">
                                <option>gpm</option>
                                <option>lpm</option>
                            </select>
                        </span>
                    </div>
                </div>
            </div>

        </div>
    </div>

</template>

<style scoped>
</style>