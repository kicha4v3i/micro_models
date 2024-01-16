<script setup>
import { ref, computed } from 'vue'
import store from '@/store'

// Data
const gelStrength = ref('')

// Units
const totalPressUnit = ref('psi')

// Base Units
const pipeLengthBase = computed(() => {
    if (store.inputUnits.pipeLengthUnit == 'm') {
        return store.mainInputs.pipeLength * 3.281
    } else {
        return store.mainInputs.pipeLength
    }
})

const dbBaseUnit = computed(() => {
    if (store.inputUnits.bitSizeUnit == 'mm') {
        return store.mainInputs.bitSize / 1000 * 3.281 * 12
    } else {
        return store.mainInputs.bitSize
    }
})

const pipeODBaseUnit = computed(() => {
    if (store.inputUnits.pipeODUnit == 'mm') {
        return store.mainInputs.pipeOD / 1000 * 3.281 * 12
    } else {
        return store.mainInputs.pipeOD
    }
})

const pipeIDBaseUnit = computed(() => {
    if (store.inputUnits.pipeIDUnit == 'mm') {
        return store.mainInputs.pipeID / 1000 * 3.281 * 12
    } else {
        return store.mainInputs.pipeID
    }
})

// Calculations
const pressBreakString = computed(() => {
    return gelStrength.value * pipeLengthBase.value / (300 * pipeIDBaseUnit.value)
})

const pressBreakAnn = computed(() => {
    return gelStrength.value * pipeLengthBase.value / (300 * (dbBaseUnit.value - pipeODBaseUnit.value))
})

const totalPress = computed(() => {
    if (totalPressUnit.value == 'psi') {
        return (pressBreakString.value + pressBreakAnn.value).toFixed(0)
    } else {
        return ((pressBreakString.value + pressBreakAnn.value) / 0.145).toFixed(0)
    }
})

</script>

<template>
    <div class="d-flex justify-content-between align-items-start">
        <div class="data-show d-flex ms-5 mt-5 align-items-center">
            <div class="inputs">

                <!-- Gel Strength -->
                <div class="d-flex align-items-center">
                    <div class="form-floating">
                        <input class="form-control" type="number" min="0" id="gelStrength" step="1" placeholder="Gel Strength" v-model="gelStrength">
                        <label for="gelStrength" class="form-label">Gel Strength</label>
                    </div>
                    <span class="align-baseline text-secondary fs-6 ms-3"><sup>lbs</sup>/<sub>100 ft<sup>2</sup></sub></span>
                </div>
            
            </div>

            <div class="outputs ms-5 d-flex flex-column align-items-center">
                <!-- Pressure to Break in Drillstring -->
                <div class="lp-height d-flex align-items-end ms-5 mb-5">
                    <div class="lp-height-out">
                        <span class="text-secondary text-uppercase fs-6">Gel Break Pressure</span>
                        <h3 class="text-center text-success">{{ totalPress }}</h3>
                    </div>
                    <div class="lp-height-unit">
                        <span>
                            <select class="form-select" v-model="totalPressUnit">
                                <option>psi</option>
                                <option>kPa</option>
                            </select>
                        </span>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>