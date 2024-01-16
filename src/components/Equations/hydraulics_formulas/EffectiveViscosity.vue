<script setup>
import store from '@/store';
import { ref, computed } from 'vue'
import { routerKey } from 'vue-router';

// Data
const n = ref('')
const K = ref('')

// Units
const KUnit = ref('eq.cP')

// Conversion
const KConv = computed(() => {
    if (KUnit.value == 'eq.cP') {
        K.value = K.value * 1000
    } else {
        K.value = K.value / 1000
    }
})

// Calculations
const mu_e = computed(() => {
    let qBaseUnit
    let dbBaseUnit
    let odBaseUnit
    let KBaseUnit

    // Convert to base units
    if (store.inputUnits.flowrateUnit == 'lpm') {
        qBaseUnit = store.mainInputs.flowrate / 3.7854
    } else {
        qBaseUnit = store.mainInputs.flowrate
    }

    if (store.inputUnits.bitSizeUnit == 'mm') {
        dbBaseUnit = store.mainInputs.bitSize / 1000 * 3.281 * 12
    } else {
        dbBaseUnit = store.mainInputs.bitSize
    }

    if (store.inputUnits.pipeODUnit == 'mm') {
        odBaseUnit = store.mainInputs.pipeOD / 1000 * 3.281 * 12
    } else {
        odBaseUnit = store.mainInputs.pipeOD
    }

    if (KUnit.value == 'Poise') {
        KBaseUnit = K.value
    } else {
        KBaseUnit = K.value / 1000
    }

    const av = 24.51 * qBaseUnit / (dbBaseUnit * dbBaseUnit - odBaseUnit * odBaseUnit) / 60
    return (100 * KBaseUnit * Math.pow(144 * av / (dbBaseUnit - odBaseUnit), n.value - 1)).toFixed(2)
})

</script>

<template>
    <div class="d-flex justify-content-between align-items-start">
        <div class="data-show d-flex ms-5 mt-5 align-items-center">
            <div class="inputs">

                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="n" step="0.01" placeholder="n" v-model="n">
                        <label for="n" class="form-label">n</label>
                    </div>
                </div>

                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="K" step="0.01" placeholder="consistencyIndex" v-model="K">
                        <label for="K" class="form-label">Consistency Index</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="KConv" v-model="KUnit" class="form-select border-info">
                            <option>eq.cP</option>
                            <option>Poise</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="outputs ms-5">
                
                    <span class="text-secondary text-uppercase fs-6">Effective Viscosity</span>
                    <div class="d-flex justify-content-center">
                        <h3 class="text-center text-success">{{ mu_e }}</h3>
                        <span class="align-baseline text-secondary fs-6 ms-3">cP</span>
                    </div>
                    
           
            </div>

        </div>
    </div>
</template>

<style scoped>
</style>
