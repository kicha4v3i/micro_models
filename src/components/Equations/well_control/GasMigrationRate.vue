<script setup>
import { ref, computed } from 'vue';
import store from '@/store'

// Data
const Pi = ref('')
const Pf = ref('')
const time = ref(1)

// Units
const PiUnits = ref('psi')
const PfUnits = ref('psi')
const migrationRateUnit = ref('ft/hr')

// Empirical Method Option
const empiricalMethod = ref(false)

// Toggle method
const selectMethod = computed(() => {
    empiricalMethod.value != empiricalMethod.value
    console.log(empiricalMethod.value)
})

// Conversion 
const PiConv = computed(() => {
    if (PiUnits.value == 'psi') {
        Pi.value = (Pi.value * 0.145).toFixed(0)
    } else {
        Pi.value = (Pi.value / 0.145).toFixed(0)
    }
})

const PfConv = computed(() => {
    if (PfUnits.value == 'psi') {
        Pf.value = (Pf.value * 0.145).toFixed(0)
    } else {
        Pf.value = (Pf.value / 0.145).toFixed(0)
    }
})

// Calculations
const migrationRate = computed(() => {
    let mwBaseUnit
    let PiBaseUnit
    let PfBaseUnit

    if (store.inputUnits.mwUnit == 'g/cc') {
        mwBaseUnit = store.mainInputs.mw * 8.33
    } else {
        mwBaseUnit = store.mainInputs.mw
    }

    if (PiUnits.value == 'kPa') {
        PiBaseUnit = Pi.value * 0.145
    } else {
        PiBaseUnit = Pi.value
    }

    if (PfUnits.value == 'kPa') {
        PfBaseUnit = Pf.value * 0.145
    } else {
        PfBaseUnit = Pf.value
    }

    let rate = (PfBaseUnit - PiBaseUnit) / time.value
    let gradient = mwBaseUnit * 0.052

    // Empirical Method
    if (empiricalMethod.value) {
        if (migrationRateUnit.value == 'ft/hr') {
            return (12 * Math.pow(2.718, -0.37 * mwBaseUnit) * 3600).toFixed(0)
        } else {
            return (12 * Math.pow(2.718, -0.37 * mwBaseUnit) / 3.281 * 3600).toFixed(0)
        }  
    } else {
        if (migrationRateUnit.value == 'ft/hr') {
            return (rate / gradient).toFixed(0)
        } else {
            return (rate / gradient / 3.281).toFixed(0)
        }
    } 
})

</script>

<template>
    <div class="d-flex justify-content-between align-items-start">
        <div class="data-show d-flex ms-5 mt-5 align-items-center">
            <div class="inputs">
                <h3 class="fs-5 ms-5">Gas Migration Rate</h3>

                <!-- Switch for Empirical Method -->
                <div class="form-check form-switch">
                    <input @change="selectMethod" v-model="empiricalMethod" class="form-check-input" type="checkbox" role="switch" id="empiricalSwitch">
                    <label class="form-check-label" for="empiricalSwitch">Empirical Method</label>
                </div>

                <!-- Initial Pressure -->
                <div v-if="!empiricalMethod" class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="Pi" step="0.01" placeholder="Initial Pressure" v-model="Pi">
                        <label for="Pi" class="form-label">Initial Pressure</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="PiConv" v-model="PiUnits" class="form-select border-info">
                            <option>psi</option>
                            <option>kPa</option>
                        </select>
                    </div>
                </div>

                <div v-else class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="Pi" step="0.01" placeholder="Initial Pressure" v-model="Pi" disabled>
                        <label for="Pi" class="form-label">Initial Pressure</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="PiConv" v-model="PiUnits" class="form-select border-info" disabled>
                            <option>psi</option>
                            <option>kPa</option>
                        </select>
                    </div>
                </div>

                <!-- Final Pressure -->
                <div v-if="!empiricalMethod" class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="Pf" step="0.01" placeholder="Final Pressure" v-model="Pf">
                        <label for="Pf" class="form-label">Final Pressure</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="PfConv" v-model="PfUnits" class="form-select border-info">
                            <option>psi</option>
                            <option>kPa</option>
                        </select>
                    </div>
                </div>

                <div v-else class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="Pf" step="0.01" placeholder="Final Pressure" v-model="Pf" disabled>
                        <label for="Pf" class="form-label">Final Pressure</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="PfConv" v-model="PfUnits" class="form-select border-info" disabled>
                            <option>psi</option>
                            <option>kPa</option>
                        </select>
                    </div>
                </div>

                <!-- Time Taken for Migration -->
                <div v-if="!empiricalMethod" class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="time" step="0.1" placeholder="Time" v-model="time">
                        <label for="time" class="form-label">Time for Migration</label>
                    </div>
                    <span class="align-baseline text-secondary fs-6 ms-3">hours</span>
                </div>

                <div v-else class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="time" step="0.1" placeholder="Time" v-model="time" disabled>
                        <label for="time" class="form-label">Time for Migration</label>
                    </div>
                    <span class="align-baseline text-secondary fs-6 ms-3">hours</span>
                </div>
            </div>

            <div class="outputs ms-5">
                <div class="lp-height d-flex align-items-end">
                    <div class="lp-height-out">
                        <span class="text-secondary text-uppercase fs-6">Migration Rate</span>
                        <h3 class="text-center text-success">{{ migrationRate }}</h3>
                    </div>
                    <div class="lp-height-unit">
                        <span>
                            <select class="form-select" v-model="migrationRateUnit">
                                <option>ft/hr</option>
                                <option>m/hr</option>
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