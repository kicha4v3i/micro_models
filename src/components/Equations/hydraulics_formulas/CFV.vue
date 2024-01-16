<script setup>
import { ref, computed } from 'vue'
import store from '@/store'

// Data
const nozzleVel = ref('')
const nozzleNo = ref('')

// Units
const nozzleVelUnit = ref('ft/sec')
const cfvUnit = ref('ft/sec')

// Conversion
const nozzleVelConv = computed(() => {
    if (nozzleVelUnit.value == 'ft/sec') {
        nozzleVel.value = (nozzleVel.value * 3.281).toFixed(0)
    } else {
        nozzleVel.value = (nozzleVel.value / 3.281).toFixed(0)
    }
})

// Calculations
const cfv = computed(() => {
    let qBaseUnit
    let dbBaseUnit
    let nozzleVelBaseUnit
    
    // Convert to base units
    if (store.inputUnits.flowrateUnit == 'lpm') {
        qBaseUnit = store.mainInputs.flowrate / 3.7854
    } else {
        qBaseUnit = store.mainInputs.flowrate
    }

    console.log(store.inputUnits.flowrateUnit)
    console.log(qBaseUnit)

    if (store.bitSizeUnit == 'mm') {
        dbBaseUnit = store.mainInputs.bitSizeConv('inch')
    } else {
        dbBaseUnit = store.mainInputs.bitSize
    }

    if (nozzleVelUnit.value == 'm/sec') {
        nozzleVelBaseUnit = nozzleVel.value *3.281
    } else {
        nozzleVelBaseUnit = nozzleVel.value
    }

    // Calculate CFV
    if (cfvUnit.value == 'ft/sec') {
        return Math.sqrt((108.5 * qBaseUnit * nozzleVelBaseUnit) / (nozzleNo.value * dbBaseUnit)).toFixed(0)
    } else {
        return (Math.sqrt((108.5 * qBaseUnit * nozzleVelBaseUnit) / (nozzleNo.value * dbBaseUnit)) / 3.281).toFixed(0)
    }
})

</script>

<template>
    <div class="d-flex justify-content-between align-items-start">
        <div class="data-show d-flex ms-5 mt-5 align-items-center">
            <div class="inputs">
                <h3 class="fs-5 ms-5">Crossflow Velocity under Drillbit</h3>

                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="nozzleVel" step="0.01" placeholder="nozzleVel" v-model="nozzleVel">
                        <label for="nozzleVel" class="form-label">Nozzle Velocity</label>
                    </div>
                    <div class="unit ms-3">
                        <select @change="nozzleVelConv" v-model="nozzleVelUnit" class="form-select border-info">
                            <option>ft/sec</option>
                            <option>m/sec</option>
                        </select>
                    </div>
                </div>

                <div class="d-flex mt-3 align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="1" id="nozzleNo" step="1" placeholder="nozzleNo" v-model="nozzleNo">
                        <label for="nozzleNo" class="form-label">Number of Nozzles</label>
                    </div>
                </div>
            </div>

            <div class="outputs ms-5">
                <div class="lp-height d-flex align-items-end">
                    <div class="lp-height-out">
                        <span class="text-secondary text-uppercase fs-6">Crossflow Velocity</span>
                        <h3 class="text-center text-success">{{ cfv }}</h3>
                    </div>
                    <div class="lp-height-unit">
                        <span>
                            <select class="form-select" v-model="cfvUnit">
                                <option>ft/sec</option>
                                <option>m/sec</option>
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
