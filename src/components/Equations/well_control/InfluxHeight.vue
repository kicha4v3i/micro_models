<script setup>
import { ref, computed } from 'vue';
import store from '@/store'

// Data
const maasp = ref('')
const influxGradient = ref('')

// Units
const maaspUnit = ref('psi')
const influxGradUnit = ref('psi/ft')
let influxGradInit = 'psi/ft'
const influxHeightUnit = ref('ft')

// Conversions
const maaspConv = computed(() => {
    if (maaspUnit.value == 'psi') {
        maasp.value = (maasp.value * 0.145).toFixed(0)
    } else {
        maasp.value = (maasp.value / 0.145).toFixed(0)
    }
})

const influxGradConv = computed(() => {
    if (influxGradInit == 'psi/ft') {
        if (influxGradUnit.value == 'ppg') {
            influxGradient.value = (influxGradient.value / 0.052).toFixed(2)
            influxGradInit = 'ppg'
        } else {
            influxGradient.value = (influxGradient.value / 0.052 / 8.33).toFixed(2)
            influxGradInit = 'g/cc'
        }
    } else if (influxGradInit == 'ppg') {
        if (influxGradUnit.value == 'psi/ft') {
            influxGradient.value = (influxGradient.value * 0.052).toFixed(3)
            influxGradInit = 'psi/ft'
        } else {
            influxGradient.value = (influxGradient.value / 8.33).toFixed(2)
            influxGradInit = 'g/cc'
        }
    } else {
        if (influxGradUnit.value == 'psi/ft') {
            influxGradient.value = (influxGradient.value * 8.33 * 0.052).toFixed(3)
            influxGradInit = 'psi/ft'
        } else {
            influxGradient.value = (influxGradient.value * 8.33).toFixed(2)
            influxGradInit = 'ppg'
        }
    }
})

// Calculation
const influxHeight = computed(() => {
    // Base Units
    let maaspBaseUnit
    let influxGradBaseUnit
    let mwBaseUnit

    if (maaspUnit.value == 'kPa') {
        maaspBaseUnit = maasp.value * 0.145
    } else {
        maaspBaseUnit = maasp.value
    }

    if (influxGradUnit.value == 'ppg') {
        influxGradBaseUnit = influxGradient.value * 0.052
    } else if (influxGradUnit.value == 'g/cc') {
        influxGradBaseUnit = influxGradient.value * 0.052 * 8.33
    } else {
        influxGradBaseUnit = influxGradient.value
    }

    if (store.inputUnits.mwUnit == 'g/cc') {
        mwBaseUnit = store.mainInputs.mw * 8.33 * 0.052
    } else {
        mwBaseUnit = store.mainInputs.mw * 0.052
    }

    // Calculations
    if (influxHeightUnit.value == 'ft') {
        return (maaspBaseUnit / (mwBaseUnit - influxGradBaseUnit)).toFixed(0)
    } else {
        return ((maaspBaseUnit / (mwBaseUnit - influxGradBaseUnit)) / 3.281).toFixed(0)
    }


})


</script>

<template>
    <div class="d-flex justify-content-between align-items-start">
        <div class="data-show d-flex ms-5 mt-5 align-items-center">
            <div class="inputs">
                <h3 class="fs-5 ms-5">Influx Height</h3>

                <!-- Maximum allowable Casing Pressure -->
                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="maasp" step="1" placeholder="MAASP" v-model="maasp">
                        <label for="maasp" class="form-label">Max Casing Pressure</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="maaspConv" v-model="maaspUnit" class="form-select border-info">
                            <option>psi</option>
                            <option>kPa</option>
                        </select>
                    </div>
                </div>

                <!-- Influx Gradient -->
                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="influxGradient" step="0.01" placeholder="Influx Gradient" v-model="influxGradient">
                        <label for="influxGradient" class="form-label">Influx Gradient</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="influxGradConv" v-model="influxGradUnit" class="form-select border-info">
                            <option>psi/ft</option>
                            <option>ppg</option>
                            <option>g/cc</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="outputs ms-5">
                <div class="lp-height d-flex align-items-end">
                    <div class="lp-height-out">
                        <span class="text-secondary text-uppercase fs-6">Influx Height</span>
                        <h3 class="text-center text-success">{{ influxHeight }}</h3>
                    </div>
                    <div class="lp-height-unit">
                        <span>
                            <select class="form-select" v-model="influxHeightUnit">
                                <option>ft</option>
                                <option>m</option>
                            </select>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>